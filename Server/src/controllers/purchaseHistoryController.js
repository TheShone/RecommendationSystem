const purchaseHistoryService = require("../services/purchaseHistoryService");

async function getPurchaseHistory(req, res) {
  try {
    const purchaseHistory = await purchaseHistoryService.getPurchaseHistory(
      req.params.id
    );
    if (!purchaseHistory) {
      return res.status(404).send("The user has not made any purchases.");
    }
    res.status(200).json(purchaseHistory);
  } catch (err) {
    return res.status(500).send(err);
  }
}
async function createPurchaseHistory(req, res) {
  try {
    const { user_id, product_id, purchase_date } = req.body;
    const response = await purchaseHistoryService.createPurchaseHistory(
      user_id,
      product_id,
      purchase_date
    );
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
async function deletePurchaseHistory(req, res) {
  try {
    await purchaseHistoryService.deletePurchaseHistory(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getPurchaseHistory,
  createPurchaseHistory,
  deletePurchaseHistory,
};
