// Test giỏ hàng -> đặt hàng -> quản lý đơn.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { startServer, call, loginAs, ADMIN, USER } = require("./helpers");

let server, base, userToken, adminToken;
const stockOf = async (id) => (await call(base, "GET", `/products/${id}`)).body.stock;
const info = { phone: "0901234567", address: "Hà Nội" };

before(async () => {
  ({ server, base } = await startServer());
  userToken = await loginAs(base, ...USER);
  adminToken = await loginAs(base, ...ADMIN);
});
after(() => server.close());

test("đặt hàng khi chưa đăng nhập bị chặn (401)", async () => {
  const res = await call(base, "POST", "/checkout", { items: [{ id: 1, quantity: 1 }], ...info });
  assert.equal(res.status, 401);
});

test("giỏ hàng trống hoặc thiếu địa chỉ trả về 400", async () => {
  assert.equal((await call(base, "POST", "/checkout", { items: [], ...info }, userToken)).status, 400);
  assert.equal((await call(base, "POST", "/checkout", { items: [{ id: 1, quantity: 1 }] }, userToken)).status, 400);
});

test("đặt hàng thành công: tạo đơn, tổng tiền đúng, tồn kho giảm", async () => {
  const before = await stockOf(1);
  const res = await call(base, "POST", "/checkout", { items: [{ id: 1, quantity: 2 }], ...info }, userToken);
  assert.equal(res.status, 201);
  assert.equal(await stockOf(1), before - 2);

  const mine = await call(base, "GET", "/orders/mine", null, userToken);
  const order = mine.body.find((o) => o.id === res.body.orderId);
  assert.equal(order.total, 2 * 8290000); // giá lấy từ DB: 8.290.000₫ / chiếc
  assert.equal(order.status, "Chờ duyệt");
  assert.equal(order.items.length, 1);
});

test("server tự tính giá, không tin giá do client gửi", async () => {
  const res = await call(base, "POST", "/checkout", { items: [{ id: 2, quantity: 1, price: 1 }], ...info }, userToken);
  const mine = await call(base, "GET", "/orders/mine", null, userToken);
  assert.equal(mine.body.find((o) => o.id === res.body.orderId).total, 10490000);
});

test("đặt vượt tồn kho bị từ chối và không trừ kho", async () => {
  const before = await stockOf(3);
  const res = await call(base, "POST", "/checkout", { items: [{ id: 3, quantity: before + 1 }], ...info }, userToken);
  assert.equal(res.status, 400);
  assert.equal(await stockOf(3), before);
});

test("sản phẩm không tồn tại trong giỏ bị từ chối", async () => {
  const res = await call(base, "POST", "/checkout", { items: [{ id: 9999, quantity: 1 }], ...info }, userToken);
  assert.equal(res.status, 400);
});

test("admin hủy đơn thì tồn kho được cộng lại", async () => {
  const before = await stockOf(5);
  const order = await call(base, "POST", "/checkout", { items: [{ id: 5, quantity: 3 }], ...info }, userToken);
  assert.equal(await stockOf(5), before - 3);

  const cancel = await call(base, "PUT", `/admin/orders/${order.body.orderId}/status`, { status: "Đã hủy" }, adminToken);
  assert.equal(cancel.status, 200);
  assert.equal(await stockOf(5), before);
});

test("trạng thái đơn không hợp lệ trả về 400", async () => {
  const res = await call(base, "PUT", "/admin/orders/1/status", { status: "linh tinh" }, adminToken);
  assert.equal(res.status, 400);
});

test("dashboard không tính doanh thu của đơn đã hủy", async () => {
  const orders = (await call(base, "GET", "/admin/orders", null, adminToken)).body;
  const expected = orders.filter((o) => o.status !== "Đã hủy").reduce((s, o) => s + o.total, 0);
  const dash = await call(base, "GET", "/admin", null, adminToken);
  assert.equal(dash.body.revenue, expected);
  assert.equal(dash.body.orders, orders.length);
});
