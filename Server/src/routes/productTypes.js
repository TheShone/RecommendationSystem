const express = require("express");
const {
  getProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType,
} = require("../controllers/productTypeContoller");

const router = express.Router();

router.get("/", getProductTypes);
router.get("/:id", getProductTypeById);
router.post("/", createProductType);
router.put("/:id", updateProductType);
router.delete("/:id", deleteProductType);

module.exports = router;
