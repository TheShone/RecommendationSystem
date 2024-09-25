const express = require("express");
const {
  getRecommendations,
  getSimilarUsers,
  getSimilarUsers2,
} = require("../controllers/recommendationController");

const router = express.Router();
router.get("/:id", getRecommendations);
router.get("/simU/:id", getSimilarUsers);
router.get("/simU2/:id", getSimilarUsers2);

module.exports = router;
