const express = require("express");
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const router = express.Router();
const {
  authenticate,
  authorizedAdmin,
} = require("../middlewares/authMiddleware");
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.post("/", authenticate, authorizedAdmin, createBrand);
router.put("/:id", authenticate, authorizedAdmin, updateBrand);
router.delete("/:id", authenticate, authorizedAdmin, deleteBrand);

module.exports = router;
