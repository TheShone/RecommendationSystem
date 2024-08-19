const express = require("express");
const {
  getRecommendations,
} = require("../controllers/recommendationController");

const router = express.Router();
router.get("/:id", getRecommendations);
module.exports = router;
