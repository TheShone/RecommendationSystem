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
    photo
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
  }
}
module.exports = User;
