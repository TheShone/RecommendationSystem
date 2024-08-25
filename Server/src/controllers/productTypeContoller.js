const productTypeService = require("../services/productTypeService");

async function getProductTypes(req, res) {
  try {
    const productTypes = await productTypeService.getProductTypes();
    res.status(200).json(productTypes);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function getProductTypeById(req, res) {
  try {
    const id = req.params.id;
    const productType = await productTypeService.getProductTypeById(id);
    if (!productType) res.status(404).send("Product Type not found");
    res.status(200).json(productType);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function createProductType(req, res) {
  try {
    const name = req.body.name;
    const existingType = await productTypeService.getProductTypeByName(name);
    if (!existingType) {
      const productType = await productTypeService.createProductType(name);
      res.status(200).json(productType);
    } else {
      res.status(409).json("Already exists that type of product type");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function updateProductType(req, res) {
  try {
    const name = req.body.name;
    const id = req.params.id;
    const productType = await productTypeService.updateProductType(id, name);
    res.status(200).json(productType);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function deleteProductType(req, res) {
  try {
    const id = req.params.id;
    await productTypeService.deleteProductType(id);
    res.status(200).json({ message: "Product Type successfully deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
}
module.exports = {
  getProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType,
};
