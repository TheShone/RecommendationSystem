const express = require("express");
const {
  getRatings,
  updateRating,
  createRating,
  deleteRating,
} = require("../controllers/ratingController");
const router = express.Router();

router.get("/:id", getRatings);
router.post("/", createRating);
router.put("/:id", updateRating);
router.delete("/:id", deleteRating);

module.exports = router;
