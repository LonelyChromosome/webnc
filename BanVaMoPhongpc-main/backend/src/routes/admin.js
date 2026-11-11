// API quản trị, gắn dưới /api/admin. router.use(requireAdmin) nghĩa là mọi route bên dưới đều phải là admin.
const express = require("express");
const AdminController = require("../controllers/AdminController");
const { requireAdmin } = require("../config/AuthFilter");

const router = express.Router();

router.use(requireAdmin);
router.get("/", AdminController.dashboard);
router.get("/products", AdminController.products);
router.post("/products", AdminController.createProduct);
router.put("/products/:id", AdminController.updateProduct);
router.delete("/products/:id", AdminController.deleteProduct);
router.get("/orders", AdminController.orders);
router.put("/orders/:id/status", AdminController.updateOrder);

module.exports = router;
