const userService = require("c:/Fax/Cetvrta godina/Diplomski/RecommendationSystem/Server/src/services/userService.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
async function loginUser(req, res) {
  try {
    const user = await userService.getUserByEmail(req.body.email);
    if (user == null) return res.status(422).json("User not found");
    const pass = bcrypt.compareSync(req.body.password, user.password);
    if (pass) {
      const loggedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      jwt.sign(
        loggedUser,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30d" },
        (err, accessToken) => {
          if (err) throw "Error";
          res
            .cookie("jwt", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV != "development",
              sameSite: "strict",
              maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .json(loggedUser);
        }
      );
    } else res.status(422).send("Wrong password");
  } catch (err) {
    return res.status(500).send(err);
  }
}
async function logoutUser(req, res) {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
}

async function createUser(req, res) {
  try {
    const {
      name,
      surname,
      username,
      email,
      password,
      dateBirth,
      address,
      photo,
      type_id,
      brand_id,
    } = req.body;
    const response = await userService.createUser(
      name,
      surname,
      username,
      email,
      password,
      dateBirth,
      address,
      photo,
      "user",
      type_id,
      brand_id
    );
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
async function updateUser(req, res) {
  try {
    const {
      name,
      surname,
      username,
      email,
      password,
      dateBirth,
      address,
      photo,
    } = req.body;
    const updatedUser = await userService.updateUser(
      req.params.id,
      name,
      surname,
      username,
      email,
      password,
      dateBirth,
      address,
      photo
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
async function createPrefereces(req, res) {
  try {
    const { type_id, brand_id } = req.body;
    const userWithPreferences = await userService.createPrefereces(
      req.params.id,
      type_id,
      brand_id
    );
    res.json(userWithPreferences);
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
function authenticateToken(req, res, next) {
  const authHeader = req.headers["autherization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, value) => {
    if (err) return res.sendStatus(403);
    req.value = value;
    next();
  });
}
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  authenticateToken,
  logoutUser,
  createPrefereces,
};
