// Truy vấn bảng users. (Mật khẩu lưu chữ thường như file gốc; muốn an toàn hơn có thể băm bằng bcrypt tại create() và verify().)
const db = require("../config/DBConnection");

function safeUser(user) {
  if (!user) return null;
  const { password: _password, ...withoutPassword } = user; // bỏ mật khẩu trước khi trả ra ngoài
  return withoutPassword;
}

async function findByEmail(email) {
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [Number(id)]);
  return safeUser(rows[0]);
}

async function create({ name, email, password }) {
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'customer')",
    [name, email, password]
  );
  return findById(result.insertId);
}

async function verify(email, password) {
  const user = await findByEmail(email);
  if (!user || user.password !== password) return null;
  return safeUser(user);
}

module.exports = { findByEmail, findById, create, verify };
