const express = require("express");
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const router = express.Router();
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.post("/", createBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

module.exports = router;
