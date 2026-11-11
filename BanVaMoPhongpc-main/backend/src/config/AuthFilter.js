// Bộ lọc đăng nhập bằng JWT (thay cho session của file gốc).
// Frontend gửi header:  Authorization: Bearer <token>
// Token do AuthController.login tạo ra bằng signToken(); ở đây kiểm tra lại và gắn người dùng vào req.user.
const jwt = require("jsonwebtoken");

const SECRET = () => process.env.JWT_SECRET || "kada-store-dev-secret";

function signToken(user) {
  return jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET(), { expiresIn: "7d" });
}

function requireLogin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Vui lòng đăng nhập để tiếp tục." });
  try {
    req.user = jwt.verify(token, SECRET()); // { id, name, role }
    next();
  } catch {
    res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." });
  }
}

function requireAdmin(req, res, next) {
  requireLogin(req, res, () => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Bạn không có quyền truy cập trang quản trị." });
    next();
  });
}

module.exports = { signToken, requireLogin, requireAdmin };
