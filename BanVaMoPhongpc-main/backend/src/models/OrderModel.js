// Truy vấn bảng orders và order_items.
const db = require("../config/DBConnection");
const ProductModel = require("./ProductModel");

async function withItems(orders) {
  for (const order of orders) {
    const [items] = await db.execute("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
    order.items = items;
  }
  return orders;
}

async function getAll() {
  const [rows] = await db.execute("SELECT * FROM orders ORDER BY id DESC");
  return withItems(rows);
}

async function getByUser(userId) {
  const [rows] = await db.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC", [Number(userId)]);
  return withItems(rows);
}

// Tạo đơn hàng. cart = [{ product, quantity }] (product lấy từ DB nên giá luôn đúng)
async function create({ user, cart, phone, address }) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction(); // nếu lỗi giữa chừng thì rollback, không bị đơn "nửa vời"
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const [order] = await connection.execute(
      "INSERT INTO orders (user_id, customer_name, phone, address, total, status) VALUES (?, ?, ?, ?, ?, 'Chờ duyệt')",
      [user.id, user.name, phone, address, total]
    );
    for (const item of cart) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)",
        [order.insertId, item.product.id, item.product.name, item.product.price, item.quantity]
      );
      await ProductModel.updateStock(item.product.id, item.quantity, connection);
    }
    await connection.commit();
    return order.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Đổi trạng thái. Nếu chuyển sang "Đã hủy" thì cộng lại tồn kho.
async function updateStatus(id, status) {
  const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [Number(id)]);
  const old = rows[0];
  if (!old) return false;
  if (status === "Đã hủy" && old.status !== "Đã hủy") {
    const [items] = await db.execute("SELECT * FROM order_items WHERE order_id = ?", [old.id]);
    for (const it of items) await db.execute("UPDATE products SET stock = stock + ? WHERE id = ?", [it.quantity, it.product_id]);
  }
  await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, old.id]);
  return true;
}

// Số liệu cho trang tổng quan quản trị
async function getRevenueSummary() {
  const [rows] = await db.execute(
    `SELECT COALESCE(SUM(CASE WHEN status != 'Đã hủy' THEN total ELSE 0 END), 0) AS revenue,
            COUNT(*) AS orders,
            COALESCE(SUM(CASE WHEN status = 'Chờ duyệt' THEN 1 ELSE 0 END), 0) AS pending
     FROM orders`
  );
  return { revenue: Number(rows[0].revenue), orders: Number(rows[0].orders), pending: Number(rows[0].pending) };
}

module.exports = { getAll, getByUser, create, updateStatus, getRevenueSummary };
