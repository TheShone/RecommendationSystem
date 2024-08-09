require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./src/routes/users");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//initDatabase();

app.use("/users", userRouter);
app.get("/", (req, res) => {
  res.send("Hallo World");
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
