const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllProducts,
  getTopProducts
} = require("../controllers/productController");
const router = express.Router();
const {
  authenticate,
  authorizedAdmin,
} = require("../middlewares/authMiddleware");

router.get("/", getAllProducts);
router.get("/all", fetchAllProducts);
router.get("/top", getTopProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, authorizedAdmin, createProduct);
router.put("/:id", authenticate, authorizedAdmin, updateProduct);
router.delete("/:id", authenticate, authorizedAdmin, deleteProduct);

module.exports = router;
