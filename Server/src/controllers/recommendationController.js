const recommendationService = require("../services/recommendationService");
const duckdb = require("duckdb");

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
async function getSimilarUsers(req, res) {
  try {
    const userId = req.params.id;
    const db = new duckdb.Database(":memory:");
    const conn = db.connect();

    await conn.run("INSTALL postgres;");
    await conn.run("LOAD postgres;");

    const postgresConnStr =
      "postgresql://postgres:neca2002@localhost:5433/recommendationsystem";
    await conn.run(`ATTACH '${postgresConnStr}' AS db (TYPE POSTGRES);`);
    const simUsers = await recommendationService.findSimilarUsers(userId, conn);
    res.status(200).json(simUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
async function getSimilarUsers2(req, res) {
  try {
    const userId = req.params.id;
    const db = new duckdb.Database(":memory:");
    const conn = db.connect();

    await conn.run("INSTALL postgres;");
    await conn.run("LOAD postgres;");

    const postgresConnStr =
      "postgresql://postgres:neca2002@localhost:5433/recommendationsystem";
    await conn.run(`ATTACH '${postgresConnStr}' AS db (TYPE POSTGRES);`);
    const simUsers = await recommendationService.findSimilarUsers2(userId, conn);
    res.status(200).json(simUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
module.exports = { getRecommendations, getSimilarUsers, getSimilarUsers2 };
