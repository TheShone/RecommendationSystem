const express = require("express");
const {
  getPurchaseHistory,
  createPurchaseHistory,
  deletePurchaseHistory,
} = require("../controllers/purchaseHistoryController");

const router = express.Router();
router.get("/:id", getPurchaseHistory);
router.post("/", createPurchaseHistory);
router.delete("/", deletePurchaseHistory);

module.exports = router;
