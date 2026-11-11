// Giỏ hàng nằm ở trình duyệt (localStorage) vì dùng JWT không có session.
// Server chỉ xử lý bước thanh toán: nhận danh sách {id, quantity}, tự lấy giá/tồn kho từ DB để tránh bị sửa giá.
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");

async function checkout(req, res) {
  const { items, phone, address } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: "Giỏ hàng đang trống." });
  if (!phone || !address) return res.status(400).json({ message: "Vui lòng nhập số điện thoại và địa chỉ nhận hàng." });

  const cart = [];
  for (const item of items) {
    const product = await ProductModel.getById(item.id);
    const quantity = Math.max(Number(item.quantity) || 1, 1);
    if (!product) return res.status(400).json({ message: "Có sản phẩm không còn tồn tại." });
    if (product.stock < quantity) return res.status(400).json({ message: `"${product.name}" chỉ còn ${product.stock} sản phẩm.` });
    cart.push({ product, quantity });
  }

  const orderId = await OrderModel.create({ user: req.user, cart, phone, address });
  res.status(201).json({ orderId, message: "Đặt hàng thành công. Admin sẽ duyệt đơn sớm." });
}

// Lịch sử đơn hàng của người dùng đang đăng nhập
async function myOrders(req, res) {
  res.json(await OrderModel.getByUser(req.user.id));
}

module.exports = { checkout, myOrders };
