const brandsService = require("../services/brandService");

async function getBrands(req, res) {
  try {
    const brands = await brandsService.getBrands();
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function getBrandById(req, res) {
  try {
    const id = req.params.id;
    const brand = await brandsService.getBrandById(id);
    if (!brand) res.status(404).send("Brand not found");
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function createBrand(req, res) {
  try {
    const name = req.body.name;
    const brand = await brandsService.createBrand(name);
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function updateBrand(req, res) {
  try {
    const name = req.body.name;
    const id = req.params.id;
    const brand = await brandsService.updateBrand(id, name);
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function deleteBrand(req, res) {
  try {
    const id = req.params.id;
    await brandsService.deleteBrand(id);
    res.status(200).send("Brand successfully deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
