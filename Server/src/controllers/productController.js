const productService = require("../services/productService");

async function getAllProducts(req, res) {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function getProductById(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).json(product);
  } catch (err) {
    return res.status(500).send(err);
  }
}
async function createProduct(req, res) {
  try {
    const { name, description, price, brand_id, type_id, created_at, photo } =
      req.body;
    const response = await productService.createProduct(
      name,
      description,
      price,
      brand_id,
      type_id,
      created_at,
      photo
    );
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
async function updateProduct(req, res) {
  try {
    const { name, description, price, brand_id, type_id, created_at, photo } =
      req.body;
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      name,
      description,
      price,
      brand_id,
      type_id,
      created_at,
      photo
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function deleteProduct(req, res) {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
