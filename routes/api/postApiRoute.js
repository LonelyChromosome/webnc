const express = require("express");
const router = express.Router();

const postApiController = require("../../controllers/api/postApiController");
const {
  requireApiLogin
} = require("../../middlewares/authMiddleware");

router.get("/", postApiController.index);
router.get("/search", postApiController.search);
router.get("/:id", postApiController.show);

router.post("/", requireApiLogin, postApiController.store);
router.put("/:id", requireApiLogin, postApiController.update);
router.delete("/:id", requireApiLogin, postApiController.destroy);

module.exports = router;
