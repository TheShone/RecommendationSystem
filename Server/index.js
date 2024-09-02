require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./src/routes/users");
const brandRouter = require("./src/routes/brands");
const attributeRouter = require("./src/routes/attributes");
const productTypeRouter = require("./src/routes/productTypes");
const productRouter = require("./src/routes/products");
const productAtributeRouter = require("./src/routes/productAttributes");
const purchaseHistoryRouter = require("./src/routes/purchaseHistory");
const ratingRouter = require("./src/routes/ratings");
const recommendationRouter = require("./src/routes/recommendations");
const orderRouter = require("./src/routes/orders");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/brands", brandRouter);
app.use("/attributes", attributeRouter);
app.use("/productTypes", productTypeRouter);
app.use("/products", productRouter);
app.use("/productAttributes", productAtributeRouter);
app.use("/purchaseHistory", purchaseHistoryRouter);
app.use("/ratings", ratingRouter);
app.use("/orders", orderRouter);
app.use("/recommendation", recommendationRouter);
app.get("/", (req, res) => {
  res.send("Hallo World");
});

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
