const jwt = require("jsonwebtoken");
const userService = require("c:/Fax/Cetvrta godina/Diplomski/RecommendationSystem/Server/src/services/userService.js");
async function authenticate(req, res, next) {
  var token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await userService.getUserByEmail(decoded.email);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
}
async function authorizedAdmin(req, res, next) {
  if (req.user && req.user.role == "admin") next();
  else res.status(401).send("Not authorized as an admin");
}
module.exports = { authenticate, authorizedAdmin };
