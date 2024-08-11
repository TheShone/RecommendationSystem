const express = require("express");
const {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
} = require("../controllers/attributeContoller");

const router = express.Router();
router.get("/", getAttributes);
router.get("/:id", getAttributeById);
router.post("/", createAttribute);
router.put("/:id", updateAttribute);
router.delete("/:id", deleteAttribute);

module.exports = router;
