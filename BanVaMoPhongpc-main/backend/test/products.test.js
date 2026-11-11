// Test danh sách / chi tiết / quản lý sản phẩm.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { startServer, call, loginAs, ADMIN, USER } = require("./helpers");

let server, base, adminToken;
before(async () => {
  ({ server, base } = await startServer());
  adminToken = await loginAs(base, ...ADMIN);
});
after(() => server.close());

test("danh sách sản phẩm có 12 sản phẩm (8 linh kiện + 4 PC build sẵn)", async () => {
  const res = await call(base, "GET", "/products");
  assert.equal(res.status, 200);
  assert.equal(res.body.products.length, 12);
  assert.ok(res.body.categories.includes("PC Build sẵn"));
});

test("lọc theo danh mục CPU chỉ trả về CPU", async () => {
  const res = await call(base, "GET", "/products?category=CPU");
  assert.ok(res.body.products.length >= 2);
  assert.ok(res.body.products.every((p) => p.category === "CPU"));
});

test("tìm theo từ khóa", async () => {
  const res = await call(base, "GET", "/products?keyword=ryzen");
  assert.equal(res.body.products.length, 1);
  assert.match(res.body.products[0].name, /Ryzen/);
});

test("chi tiết sản phẩm có specs dạng object, id không tồn tại trả 404", async () => {
  const ok = await call(base, "GET", "/products/1");
  assert.equal(ok.status, 200);
  assert.equal(typeof ok.body.specs, "object");
  assert.equal(ok.body.specs.socket, "LGA1700");
  assert.equal((await call(base, "GET", "/products/9999")).status, 404);
});

test("có đúng 4 PC build sẵn theo 4 phân khúc giá tăng dần", async () => {
  const res = await call(base, "GET", "/products?category=" + encodeURIComponent("PC Build sẵn"));
  const builds = res.body.products;
  assert.deepEqual(builds.map((b) => b.specs.tier), ["Rẻ nhất", "Trung bình", "Cao cấp", "VIP Pro"]);
  assert.deepEqual(builds.map((b) => b.price), [...builds.map((b) => b.price)].sort((a, b) => a - b));
});

test("khách thường không được thêm sản phẩm (403)", async () => {
  const userToken = await loginAs(base, ...USER);
  const res = await call(base, "POST", "/admin/products", { name: "X", category: "CPU" }, userToken);
  assert.equal(res.status, 403);
});

test("admin thêm, sửa, xóa sản phẩm", async () => {
  const created = await call(base, "POST", "/admin/products", { name: "CPU thử", category: "CPU", price: 1000, stock: 3 }, adminToken);
  assert.equal(created.status, 201);
  const id = created.body.id;

  const updated = await call(base, "PUT", `/admin/products/${id}`, { name: "CPU đã sửa", category: "CPU", price: 2000, stock: 5 }, adminToken);
  assert.equal(updated.body.name, "CPU đã sửa");
  assert.equal(updated.body.price, 2000);

  assert.equal((await call(base, "DELETE", `/admin/products/${id}`, null, adminToken)).status, 200);
  assert.equal((await call(base, "GET", `/products/${id}`)).status, 404);
});

test("thêm sản phẩm thiếu tên trả về 400", async () => {
  const res = await call(base, "POST", "/admin/products", { category: "CPU" }, adminToken);
  assert.equal(res.status, 400);
});
