// Tiện ích dùng chung cho các file test (file này không chứa test).
// Mỗi file test chạy trong 1 tiến trình riêng, có database trong RAM riêng (đã gieo dữ liệu mẫu từ seed.sql),
// nên các test không ảnh hưởng nhau và không đụng vào data/kada.db thật.
process.env.DB_FILE = ":memory:";
process.env.JWT_SECRET = "test-secret";

const { once } = require("node:events");
const app = require("../app");
const db = require("../src/config/DBConnection");

// Mở server tạm ở cổng ngẫu nhiên, trả về địa chỉ gốc của API
async function startServer() {
  await db.ready;
  const server = app.listen(0);
  await once(server, "listening");
  return { server, base: `http://localhost:${server.address().port}/api` };
}

// Gọi API và trả về { status, body }. token (nếu có) được gắn vào header Authorization.
async function call(base, method, path, body, token) {
  const res = await fetch(base + path, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

// Đăng nhập bằng tài khoản mẫu trong seed.sql, trả về token
async function loginAs(base, email, password) {
  const res = await call(base, "POST", "/login", { email, password });
  return res.body.token;
}

const ADMIN = ["admin@store.test", "admin123"];
const USER = ["user@store.test", "user123"];

module.exports = { startServer, call, loginAs, db, ADMIN, USER };
