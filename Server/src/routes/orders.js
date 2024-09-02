const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();
router.get("/", orderController.getOrders);

router.get("/:user_id", orderController.getOrdersByUser);

router.post("/", orderController.createOrder);

router.put("/:id/status", orderController.updateOrderStatus);

router.delete("/:id", orderController.deleteOrder);

module.exports = router;
