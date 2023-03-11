const router = require("express").Router();
const User = require("../models/User");

//ユーザー登録
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const saveUser = await newUser.save();
    return res.status(200).json(saveUser);
  } catch (e) {
    console.log("register error");
    console.log(e);
    return res.status(500).json(e);
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(404).send("ユーザーが見つかりませんでした")
    const vailedPassword = req.body.password === user.password
    if(!vailedPassword) return res.status(400).json("パスワードが違います。")
    return res.status(200).json(user)
  } catch (e) {
    console.log("login error");
    console.log(e);
    return res.status(500).json(e);
  }
});

router.get("/register", (req, res) => {
  res.send("this is register page");
});

module.exports = router;
