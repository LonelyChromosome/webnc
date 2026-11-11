// Đăng ký / đăng nhập. Điểm khác file gốc: thay vì lưu req.session.user, ta tạo JWT và trả về cho frontend.
const UserModel = require("../models/UserModel");
const { signToken } = require("../config/AuthFilter");

async function login(req, res) {
  const user = await UserModel.verify(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ message: "Email hoặc mật khẩu chưa đúng." });
  res.json({ token: signToken(user), user });
}

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Vui lòng nhập đủ họ tên, email và mật khẩu." });
  if (await UserModel.findByEmail(email)) return res.status(409).json({ message: "Email đã được sử dụng." });
  const user = await UserModel.create({ name, email, password });
  res.status(201).json({ token: signToken(user), user });
}

// Frontend gọi khi mở lại trang để biết token còn dùng được không
async function me(req, res) {
  const user = await UserModel.findById(req.user.id);
  if (!user) return res.status(401).json({ message: "Tài khoản không tồn tại." });
  res.json({ user });
}

module.exports = { login, register, me };
