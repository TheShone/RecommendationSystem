const orderService = require("../services/orderService");

async function getOrdersByUser(req, res) {
  try {
    const orders = await orderService.getOrdersByUserId(req.params.user_id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function getOrders(req, res) {
  try {
    const orders = await orderService.getOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function createOrder(req, res) {
  try {
    const { user_id, products, shipping_address, total_price, status } =
      req.body;
    const order = await orderService.createOrder(
      user_id,
      products,
      shipping_address,
      total_price,
      status
    );
    res.status(201).json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(
      req.params.id,
      status
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function deleteOrder(req, res) {
  try {
    const result = await orderService.deleteOrder(req.params.id);
    res.status(204).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = {
  getOrdersByUser,
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
