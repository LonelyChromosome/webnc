// Các API cho khách hàng. Mỗi dòng: phương thức + đường dẫn -> (bộ lọc đăng nhập) -> hàm controller.
// Tất cả được gắn dưới tiền tố /api trong app.js, ví dụ GET /api/products.
const express = require("express");
const HomeController = require("../controllers/HomeController");
const AuthController = require("../controllers/AuthController");
const ProductController = require("../controllers/ProductController");
const CartController = require("../controllers/CartController");
const PCBuilderController = require("../controllers/PCBuilderController");
const ChatController = require("../controllers/ChatController");
const { requireLogin } = require("../config/AuthFilter");

const router = express.Router();

router.get("/home", HomeController.index);
router.get("/products", ProductController.list);
router.get("/products/:id", ProductController.detail);
router.get("/pc-builder", PCBuilderController.show);
router.post("/chat", ChatController.advise);

router.post("/checkout", requireLogin, CartController.checkout);
router.get("/orders/mine", requireLogin, CartController.myOrders);

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/me", requireLogin, AuthController.me);

module.exports = router;
