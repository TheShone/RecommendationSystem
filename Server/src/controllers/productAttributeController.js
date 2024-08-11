const productAttributeService = require("../services/productAttributeService");

async function getProductAttributes(req, res) {
  try {
    const attributes = await productAttributeService.getProductAttributes(
      req.params.id
    );
    res.status(200).json(attributes);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function createProductAttribute(req, res) {
  try {
    const { product_id, attribute_id, value } = req.body;
    const productAttribute =
      await productAttributeService.createProductAttribute(
        product_id,
        attribute_id,
        value
      );
    res.status(200).json(productAttribute);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function updateProductAttribute(req, res) {
  try {
    const { product_id, attribute_id, value } = req.body;
    const productAtribute =
      await productAttributeService.updateProductAttribute(
        product_id,
        attribute_id,
        value
      );
    res.status(200).json(productAtribute);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function deleteProductAttribute(req, res) {
  try {
    const { product_id, attribute_id } = req.body;
    await productAttributeService.deleteProductAttribute(
      product_id,
      attribute_id
    );
    res.status(200).send("Product attribute successfully deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getProductAttributes,
  createProductAttribute,
  updateProductAttribute,
  deleteProductAttribute,
};
