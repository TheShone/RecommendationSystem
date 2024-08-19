const recommendationService = require("../services/recommendationService");

async function getRecommendations(req, res) {
  try {
    const userId = req.params.id;
    const recommendations = await recommendationService.getRecommendations(
      userId
    );
    res.status(200).json(recommendations);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}

module.exports = { getRecommendations };
