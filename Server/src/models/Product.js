class Product {
  constructor(
    id,
    name,
    description,
    price,
    brand_id,
    type_id,
    created_at,
    photo
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.brand_id = brand_id;
    this.type_id = type_id;
    this.created_at = created_at;
    this.photo = photo;
  }
}
module.exports = Product;
