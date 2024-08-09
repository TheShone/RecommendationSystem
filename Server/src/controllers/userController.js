const userService = require("../services/userService");

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).send(err);
  }
}
async function createUser(req, res) {
  try {
    const { name, surname, username, email, password, dateBirth, address } =
      req.body;
    const response = await userService.createUser(
      name,
      surname,
      username,
      email,
      password,
      dateBirth,
      address
    );
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
async function updateUser(req, res) {
  try {
    const { name, surname, username, email, password, dateBirth, address } =
      req.body;
    const updatedUser = await userService.updateUser(
      req.params.id,
      name,
      surname,
      username,
      email,
      password,
      dateBirth,
      address
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
