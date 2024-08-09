require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./src/routes/users");
const brandRouter = require("./src/routes/brands");
const productTypeRouter = require("./src/routes/productTypes");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//initDatabase();

app.use("/users", userRouter);
app.use("/brands", brandRouter);
app.use("/productTypes", productTypeRouter);
app.get("/", (req, res) => {
  res.send("Hallo World");
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
