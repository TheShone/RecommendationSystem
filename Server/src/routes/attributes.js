const express = require("express");
const {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
} = require("../controllers/attributeContoller");

const router = express.Router();
const {
  authenticate,
  authorizedAdmin,
} = require("../middlewares/authMiddleware");
router.get("/", getAttributes);
router.get("/:id", getAttributeById);
router.post("/", authenticate, authorizedAdmin, createAttribute);
router.put("/:id", authenticate, authorizedAdmin, updateAttribute);
router.delete("/:id", authenticate, authorizedAdmin, deleteAttribute);

module.exports = router;
