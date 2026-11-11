// Dữ liệu trang chủ: sản phẩm nổi bật + PC build sẵn.
const ProductModel = require("../models/ProductModel");

async function index(req, res) {
  res.json({
    featured: await ProductModel.getFeatured(),
    builds: await ProductModel.getAll({ category: "PC Build sẵn" }),
    categories: await ProductModel.getCategories(),
  });
}

module.exports = { index };
