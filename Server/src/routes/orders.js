const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();
router.get("/", orderController.getOrders);

router.get("/:user_id", orderController.getOrdersByUser);

router.get("/order/:id", orderController.getOrderById);

router.post("/", orderController.createOrder);

router.put("/:id", orderController.updateOrderStatus);

router.delete("/:id", orderController.deleteOrder);

module.exports = router;
