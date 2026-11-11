// Test trực tiếp các model (không qua HTTP): kiểm tra tầng truy vấn dữ liệu.
const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { db } = require("./helpers");
const ProductModel = require("../src/models/ProductModel");
const UserModel = require("../src/models/UserModel");
const OrderModel = require("../src/models/OrderModel");
const PCBuilderModel = require("../src/models/PCBuilderModel");

before(async () => { await db.ready; });

test("DBConnection: SELECT trả [rows], INSERT trả insertId", async () => {
  const [rows] = await db.execute("SELECT COUNT(*) AS n FROM products");
  assert.equal(rows[0].n, 12);
  const [result] = await db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", ["T", "t@t.vn", "x"]);
  assert.ok(result.insertId > 0);
  assert.equal(result.affectedRows, 1);
});

test("ProductModel: getById chuyển specs JSON thành object và featured thành boolean", async () => {
  const p = await ProductModel.getById(2);
  assert.equal(p.name, "AMD Ryzen 7 7800X3D");
  assert.equal(p.specs.socket, "AM5");
  assert.equal(p.featured, true);
  assert.equal(typeof p.price, "number");
  assert.equal(await ProductModel.getById(9999), null);
});

test("ProductModel: getFeatured không gồm PC build sẵn", async () => {
  const list = await ProductModel.getFeatured();
  assert.ok(list.length > 0);
  assert.ok(list.every((p) => p.category !== "PC Build sẵn"));
});

test("ProductModel: create / update / remove", async () => {
  const p = await ProductModel.create({ name: "RAM thử", category: "RAM", brand: "X", price: 100, stock: 2 });
  assert.equal(p.image, "/uploads/component.svg"); // ảnh mặc định
  const u = await ProductModel.update(p.id, { name: "RAM sửa", category: "RAM", brand: "X", price: 200, stock: 2 });
  assert.equal(u.price, 200);
  assert.equal(await ProductModel.remove(p.id), true);
  assert.equal(await ProductModel.remove(p.id), false);
});

test("ProductModel: updateStock không cho tồn kho âm", async () => {
  await ProductModel.updateStock(8, 1000);
  assert.equal((await ProductModel.getById(8)).stock, 0);
});

test("UserModel: verify đúng/sai mật khẩu, không trả mật khẩu", async () => {
  const ok = await UserModel.verify("user@store.test", "user123");
  assert.equal(ok.role, "customer");
  assert.equal(ok.password, undefined);
  assert.equal(await UserModel.verify("user@store.test", "sai"), null);
  assert.equal(await UserModel.verify("khongco@x.vn", "x"), null);
});

test("OrderModel: create ghi đơn + chi tiết, getRevenueSummary cộng đúng", async () => {
  const product = await ProductModel.getById(6);
  const user = await UserModel.findByEmail("user@store.test");
  const id = await OrderModel.create({ user, cart: [{ product, quantity: 2 }], phone: "1", address: "a" });
  const mine = await OrderModel.getByUser(user.id);
  assert.equal(mine.find((o) => o.id === id).total, 2 * product.price);
  const summary = await OrderModel.getRevenueSummary();
  assert.ok(summary.revenue >= 2 * product.price);
  assert.ok(summary.pending >= 1);
});

test("OrderModel: lỗi giữa chừng thì rollback, không để lại đơn nửa vời", async () => {
  const [[before]] = await db.execute("SELECT COUNT(*) AS n FROM orders");
  const user = await UserModel.findByEmail("user@store.test");
  const bad = { product: { id: 1, name: null, price: 1 }, quantity: 1 }; // product_name NULL -> vi phạm NOT NULL
  await assert.rejects(OrderModel.create({ user, cart: [bad], phone: "1", address: "a" }));
  const [[after]] = await db.execute("SELECT COUNT(*) AS n FROM orders");
  assert.equal(after.n, before.n);
});

test("PCBuilderModel: getOptions lọc mainboard theo socket CPU và RAM theo chuẩn DDR", async () => {
  const boards = await PCBuilderModel.getOptions("Mainboard", { cpuId: 1 });
  assert.ok(boards.every((b) => b.specs.socket === "LGA1700"));
  const rams = await PCBuilderModel.getOptions("RAM", { mainboardId: 4 });
  assert.ok(rams.every((r) => r.specs.type === "DDR5"));
});

test("PCBuilderModel: buildCompatibility cảnh báo nguồn yếu hơn yêu cầu GPU", async () => {
  await db.execute("UPDATE products SET specs = ? WHERE id = 8", [JSON.stringify({ power: "450W" })]);
  const res = await PCBuilderModel.buildCompatibility({ gpuId: 3, psuId: 8 });
  assert.equal(res.warnings.length, 1);
  assert.match(res.warnings[0], /650W/);
});
