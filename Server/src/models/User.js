class User {
  constructor(
    id,
    name,
    surname,
    username,
    email,
    password,
    dateBirth,
    address,
    photo,
    role,
    type_id,
    brand_id
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.email = email;
    this.password = password;
    this.dateBirth = dateBirth;
    this.address = address;
    this.photo = photo;
    this.role = role;
    this.type_id = type_id;
    this.brand_id = brand_id;
  }
}
module.exports = User;
