const express = require("express");
const {
  getProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType,
} = require("../controllers/productTypeContoller");

const router = express.Router();
const {
  authenticate,
  authorizedAdmin,
} = require("../middlewares/authMiddleware");
router.get("/", getProductTypes);
router.get("/:id", getProductTypeById);
router.post("/", authenticate, authorizedAdmin, createProductType);
router.put("/:id", authenticate, authorizedAdmin, updateProductType);
router.delete("/:id", authenticate, authorizedAdmin, deleteProductType);

module.exports = router;
