class Rating {
  constructor(id, user_id, product_id, rating, review) {
    this.id = id;
    this.user_id = user_id;
    this.product_id = product_id;
    this.rating = rating;
    this.review = review;
  }
}
module.exports = Rating;
