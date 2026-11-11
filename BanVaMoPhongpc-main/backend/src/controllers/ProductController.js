// Danh sách và chi tiết sản phẩm.
const ProductModel = require("../models/ProductModel");

async function list(req, res) {
  res.json({
    products: await ProductModel.getAll({ keyword: req.query.keyword, category: req.query.category }),
    categories: await ProductModel.getCategories(),
  });
}

async function detail(req, res) {
  const product = await ProductModel.getById(req.params.id);
  if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
  res.json(product);
}

module.exports = { list, detail };
