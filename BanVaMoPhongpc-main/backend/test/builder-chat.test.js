// Test PC Builder (kiểm tra tương thích) và trợ lý tư vấn.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { startServer, call } = require("./helpers");

let server, base;
before(async () => ({ server, base } = await startServer()));
after(() => server.close());

// id theo seed.sql: 1 i5-14600K (LGA1700), 2 Ryzen 7800X3D (AM5), 3 RTX 4070 Super (cần 650W),
// 4 MSI B760 (LGA1700), 5 Gigabyte B650 (AM5), 6 RAM DDR5, 8 PSU 750W
const builder = (q) => call(base, "GET", "/pc-builder?" + q);

test("chưa chọn gì: đủ 6 ô, không có cảnh báo", async () => {
  const res = await builder("");
  assert.deepEqual(res.body.slots, ["CPU", "Mainboard", "RAM", "GPU", "SSD", "PSU"]);
  assert.deepEqual(res.body.warnings, []);
});

test("chọn CPU AM5 thì danh sách mainboard chỉ còn mainboard AM5", async () => {
  const res = await builder("cpuId=2");
  assert.deepEqual(res.body.options.Mainboard.map((m) => m.id), [5]);
});

test("chọn CPU LGA1700 thì chỉ còn mainboard LGA1700", async () => {
  const res = await builder("cpuId=1");
  assert.deepEqual(res.body.options.Mainboard.map((m) => m.id), [4]);
});

test("CPU và mainboard khác socket thì có cảnh báo", async () => {
  const res = await builder("cpuId=2&mainboardId=4");
  assert.equal(res.body.warnings.length, 1);
  assert.match(res.body.warnings[0], /socket/);
});

test("CPU và mainboard cùng socket thì không cảnh báo", async () => {
  const res = await builder("cpuId=2&mainboardId=5&ramId=6");
  assert.deepEqual(res.body.warnings, []);
});

test("nguồn 750W đủ cho RTX 4070 Super (cần 650W)", async () => {
  const res = await builder("gpuId=3&psuId=8");
  assert.deepEqual(res.body.warnings, []);
});

test("chatbot: ngân sách 25 triệu -> bộ Trung bình", async () => {
  const res = await call(base, "POST", "/chat", { message: "PC chơi game khoảng 25 triệu" });
  assert.equal(res.body.product.specs.tier, "Trung bình");
});

test("chatbot: ngân sách 100 triệu -> VIP Pro, 50tr -> Cao cấp, 15 triệu -> Rẻ nhất", async () => {
  const ask = async (message) => (await call(base, "POST", "/chat", { message })).body.product.specs.tier;
  assert.equal(await ask("tôi có 100 triệu"), "VIP Pro");
  assert.equal(await ask("ngân sách 50tr"), "Cao cấp");
  assert.equal(await ask("khoảng 15 triệu"), "Rẻ nhất");
});

test("chatbot: ngân sách thấp hơn bộ rẻ nhất vẫn đề xuất bộ rẻ nhất", async () => {
  const res = await call(base, "POST", "/chat", { message: "chỉ có 10 triệu" });
  assert.equal(res.body.product.specs.tier, "Rẻ nhất");
});

test("chatbot: hỏi theo từ khóa phân khúc", async () => {
  const ask = async (message) => (await call(base, "POST", "/chat", { message })).body.product.specs.tier;
  assert.equal(await ask("cần pc vip"), "VIP Pro");
  assert.equal(await ask("pc cao cấp để đồ họa"), "Cao cấp");
  assert.equal(await ask("pc rẻ cho sinh viên"), "Rẻ nhất");
});

test("chatbot: câu không rõ thì hỏi lại, không đề xuất sản phẩm", async () => {
  const res = await call(base, "POST", "/chat", { message: "xin chào" });
  assert.equal(res.body.product, undefined);
  assert.ok(res.body.reply.length > 0);
});
