const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const {
  authenticate,
  authorizedAdmin,
} = require("../middlewares/authMiddleware");
const router = express.Router();
router.get("/:id", getUserById);
router.get("/", authenticate,authorizedAdmin, getAllUsers);
router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout",authenticate, logoutUser);
router.put("/:id", authenticate,updateUser);
router.delete("/:id",authenticate,authorizedAdmin, deleteUser);
module.exports = router;
