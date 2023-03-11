const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = 3000;

// データベース接続
mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => {
    console.log("connecting...");
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });

// ミドルウェア設定
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.get("/", (req, res) => {
  res.send("Hello");
  console.log("this is top page");
});
