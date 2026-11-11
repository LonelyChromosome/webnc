// Truy vấn bảng products.
const db = require("../config/DBConnection");

// specs lưu trong DB là chuỗi JSON -> đổi thành object để dùng trong code
function normalizeProduct(row) {
  if (!row) return null;
  return {
    ...row,
    price: Number(row.price),
    stock: Number(row.stock),
    featured: Boolean(row.featured),
    performance: Number(row.performance),
    specs: typeof row.specs === "string" ? JSON.parse(row.specs || "{}") : row.specs || {},
  };
}

async function getAll(filters = {}) {
  const where = [];
  const params = [];
  if (filters.keyword) {
    where.push("(name LIKE ? OR brand LIKE ?)");
    params.push(`%${filters.keyword}%`, `%${filters.keyword}%`);
  }
  if (filters.category) {
    where.push("category = ?");
    params.push(filters.category);
  }
  const sql = `SELECT * FROM products ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY id`;
  const [rows] = await db.execute(sql, params);
  return rows.map(normalizeProduct);
}

async function getFeatured() {
  const [rows] = await db.execute("SELECT * FROM products WHERE featured = 1 AND category != 'PC Build sẵn' ORDER BY id");
  return rows.map(normalizeProduct);
}

async function getById(id) {
  const [rows] = await db.execute("SELECT * FROM products WHERE id = ? LIMIT 1", [Number(id)]);
  return normalizeProduct(rows[0]);
}

async function getCategories() {
  const [rows] = await db.execute("SELECT DISTINCT category FROM products ORDER BY category");
  return rows.map((row) => row.category);
}

async function create(p) {
  const [result] = await db.execute(
    `INSERT INTO products (name, category, brand, price, stock, image, featured, performance, specs)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [p.name, p.category, p.brand || "", Number(p.price) || 0, Number(p.stock) || 0,
      p.image || "/uploads/component.svg", p.featured ? 1 : 0, Number(p.performance) || 70, JSON.stringify(p.specs || {})]
  );
  return getById(result.insertId);
}

async function update(id, p) {
  await db.execute(
    `UPDATE products SET name = ?, brand = ?, category = ?, price = ?, stock = ?, image = ?, featured = ?, performance = ?
     WHERE id = ?`,
    [p.name, p.brand || "", p.category, Number(p.price) || 0, Number(p.stock) || 0,
      p.image || "/uploads/component.svg", p.featured ? 1 : 0, Number(p.performance) || 70, Number(id)]
  );
  return getById(id);
}

async function remove(id) {
  const [result] = await db.execute("DELETE FROM products WHERE id = ?", [Number(id)]);
  return result.affectedRows > 0;
}

// Trừ tồn kho khi đặt hàng (không cho âm). connection: dùng chung kết nối của giao dịch.
async function updateStock(productId, amount, connection = db) {
  await connection.execute("UPDATE products SET stock = MAX(stock - ?, 0) WHERE id = ?", [Number(amount), Number(productId)]);
}

module.exports = { getAll, getFeatured, getById, getCategories, create, update, remove, updateStock };
