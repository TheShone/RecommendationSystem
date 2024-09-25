const express = require("express");
const { similarUsers } = require("../controllers/batchScript");

const router = express.Router();
router.post("/", similarUsers);
module.exports = router;
