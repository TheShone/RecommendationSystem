class PurchaseHistory {
  constructor(id, user_id, product_id, purchase_date) {
    this.id = id;
    this.user_id = user_id;
    this.product_id = product_id;
    this.purchase_date = purchase_date;
  }
}
module.exports = PurchaseHistory;
