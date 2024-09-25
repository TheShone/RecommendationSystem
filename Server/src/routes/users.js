const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  createPrefereces,
} = require("../controllers/userController");
const router = express.Router();
const {
  authenticate,
  authorizedAdmin,
} = require("../middlewares/authMiddleware");
router.get("/:id", getUserById);
router.get("/", authenticate, authorizedAdmin, getAllUsers);
router.post("/", createUser);
router.put("/preferences/:id", createPrefereces);
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", deleteUser);
module.exports = router;
