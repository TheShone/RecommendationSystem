const ratingService = require("../services/ratingService");

async function getRatings(req, res) {
  try {
    const ratings = await ratingService.getRatings(req.params.id);
    if (!ratings) {
      return res.status(404).send("");
    }
    console.log(ratings);
    res.status(200).json(ratings);
  } catch (err) {
    return res.status(500).send(err);
  }
}
async function createRating(req, res) {
  try {
    const { user_id, product_id, rating, review } = req.body;
    const response = await ratingService.createRating(
      user_id,
      product_id,
      rating,
      review
    );
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
async function updateRating(req, res) {
  try {
    const { user_id, product_id, rating, review } = req.body;
    const updatedRating = await ratingService.updateRating(
      req.params.id,
      user_id,
      product_id,
      rating,
      review
    );
    res.json(updatedRating);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function deleteRating(req, res) {
  try {
    await ratingService.deleteRating(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getRatings,
  updateRating,
  createRating,
  deleteRating,
};
