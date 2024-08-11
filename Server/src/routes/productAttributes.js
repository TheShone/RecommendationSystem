const express = require("express");
const {
  getProductAttributes,
  createProductAttribute,
  updateProductAttribute,
  deleteProductAttribute,
} = require("../controllers/productAttributeController");

const router = express.Router();
router.get("/:id", getProductAttributes);
router.post("/", createProductAttribute);
router.put("/", updateProductAttribute);
router.delete("/", deleteProductAttribute);

module.exports = router;
