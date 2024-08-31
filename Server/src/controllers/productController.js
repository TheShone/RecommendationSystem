const productService = require("../services/productService");

async function getAllProducts(req, res) {
  try {
    const { products, page, pages, hasMore } = await productService.getProducts(
      req.query.page
    );
    res.status(200).json({
      products,
      page,
      pages,
      hasMore,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function fetchAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function getTopProducts(req, res) {
  try {
    const products = await productService.getTopProducts();
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
    const {
      name,
      description,
      price,
      brand_id,
      type_id,
      created_at,
      photo,
      quantity,
    } = req.body;
    const response = await productService.createProduct(
      name,
      description,
      price,
      brand_id,
      type_id,
      created_at,
      photo,
      quantity
    );
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
async function updateProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      brand_id,
      type_id,
      created_at,
      photo,
      quantity,
    } = req.body;
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      name,
      description,
      price,
      brand_id,
      type_id,
      created_at,
      photo,
      quantity
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function deleteProduct(req, res) {
  try {
    console.log(req.params.id);
    const result = await productService.deleteProduct(req.params.id);
    res.status(204).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getAllProducts,
  getProductById,
  getTopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchAllProducts,
};
