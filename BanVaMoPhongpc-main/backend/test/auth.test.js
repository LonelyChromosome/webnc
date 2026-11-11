// Test đăng ký / đăng nhập / JWT / phân quyền.
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { startServer, call, loginAs, ADMIN, USER } = require("./helpers");

let server, base;
before(async () => ({ server, base } = await startServer()));
after(() => server.close());

test("đăng nhập đúng trả về token và thông tin user (không lộ mật khẩu)", async () => {
  const res = await call(base, "POST", "/login", { email: USER[0], password: USER[1] });
  assert.equal(res.status, 200);
  assert.ok(res.body.token, "phải có token");
  assert.equal(res.body.user.email, USER[0]);
  assert.equal(res.body.user.password, undefined);
});

test("đăng nhập sai mật khẩu trả về 401", async () => {
  const res = await call(base, "POST", "/login", { email: USER[0], password: "sai-mat-khau" });
  assert.equal(res.status, 401);
});

test("đăng ký tài khoản mới rồi dùng token gọi /me", async () => {
  const reg = await call(base, "POST", "/register", { name: "Test", email: "moi@test.vn", password: "123456" });
  assert.equal(reg.status, 201);
  const me = await call(base, "GET", "/me", null, reg.body.token);
  assert.equal(me.status, 200);
  assert.equal(me.body.user.email, "moi@test.vn");
  assert.equal(me.body.user.role, "customer");
});

test("đăng ký trùng email trả về 409", async () => {
  const res = await call(base, "POST", "/register", { name: "A", email: USER[0], password: "123456" });
  assert.equal(res.status, 409);
});

test("đăng ký thiếu thông tin trả về 400", async () => {
  const res = await call(base, "POST", "/register", { email: "x@x.vn" });
  assert.equal(res.status, 400);
});

test("không có token thì /me bị chặn (401)", async () => {
  const res = await call(base, "GET", "/me");
  assert.equal(res.status, 401);
});

test("token giả bị từ chối (401)", async () => {
  const res = await call(base, "GET", "/me", null, "token.gia.mao");
  assert.equal(res.status, 401);
});

test("khách thường không vào được API admin (403), admin thì vào được (200)", async () => {
  const userToken = await loginAs(base, ...USER);
  const adminToken = await loginAs(base, ...ADMIN);
  assert.equal((await call(base, "GET", "/admin", null, userToken)).status, 403);
  assert.equal((await call(base, "GET", "/admin", null, adminToken)).status, 200);
  assert.equal((await call(base, "GET", "/admin")).status, 401);
});
