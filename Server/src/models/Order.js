class Order {
  constructor(id, user_id, products, shipping_address, total_price, status) {
    this.id = id;
    this.user_id = user_id;
    this.products = products; 
    this.shipping_address = shipping_address;
    this.total_price = total_price;
    this.status = status; 
  }
}

module.exports = Order;
