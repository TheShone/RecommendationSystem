const batchScriptService = require("../services/batchScriptService");

async function similarUsers(req, res) {
  try {
     await batchScriptService.calculateAndStoreSimilarUsers();
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
module.exports = {similarUsers}