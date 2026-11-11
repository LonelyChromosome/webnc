// Các chức năng quản trị (chỉ admin mới vào được, xem routes/admin.js).
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");
const db = require("../config/DBConnection");

const STATUSES = ["Chờ duyệt", "Đang giao", "Hoàn tất", "Đã hủy"];

async function dashboard(req, res) {
  const summary = await OrderModel.getRevenueSummary();
  const products = await ProductModel.getAll();
  const [users] = await db.execute("SELECT COUNT(*) AS n FROM users WHERE role = 'customer'");
  res.json({
    ...summary,
    products: products.length,
    lowStock: products.filter((p) => p.stock <= 5).length,
    customers: users[0].n,
    recentOrders: (await OrderModel.getAll()).slice(0, 5),
  });
}

async function products(req, res) {
  res.json(await ProductModel.getAll());
}

async function createProduct(req, res) {
  if (!req.body.name || !req.body.category) return res.status(400).json({ message: "Tên và danh mục là bắt buộc." });
  res.status(201).json(await ProductModel.create(req.body));
}

async function updateProduct(req, res) {
  if (!(await ProductModel.getById(req.params.id))) return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
  res.json(await ProductModel.update(req.params.id, req.body));
}

async function deleteProduct(req, res) {
  const ok = await ProductModel.remove(req.params.id);
  res.status(ok ? 200 : 404).json({ message: ok ? "Đã xóa sản phẩm." : "Không tìm thấy sản phẩm." });
}

async function orders(req, res) {
  res.json(await OrderModel.getAll());
}

async function updateOrder(req, res) {
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: "Trạng thái không hợp lệ." });
  const ok = await OrderModel.updateStatus(req.params.id, req.body.status);
  res.status(ok ? 200 : 404).json({ message: ok ? "Đã cập nhật." : "Không tìm thấy đơn hàng." });
}

module.exports = { dashboard, products, createProduct, updateProduct, deleteProduct, orders, updateOrder };
