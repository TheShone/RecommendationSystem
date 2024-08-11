const attributeService = require("../services/attributeService");

async function getAttributes(req, res) {
  try {
    const attributes = await attributeService.getAttributes();
    res.status(200).json(attributes);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function getAttributeById(req, res) {
  try {
    const id = req.params.id;
    const attribute = await attributeService.getAttributeById(id);
    if (!attribute) res.status(404).send("Attribute not found");
    res.status(200).json(attribute);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function createAttribute(req, res) {
  try {
    const name = req.body.name;
    const id = req.body.type_id;
    const attribute = await attributeService.createAttribute(name, id);
    res.status(200).json(attribute);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function updateAttribute(req, res) {
  try {
    const name = req.body.name;
    const id = req.params.id;
    const id2 = req.body.type_id;
    const attribute = await attributeService.updateAttribute(id, name, id2);
    res.status(200).json(attribute);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function deleteAttribute(req, res) {
  try {
    const id = req.params.id;
    await attributeService.deleteAttribute(id);
    res.status(200).send("Attribute successfully deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
};
