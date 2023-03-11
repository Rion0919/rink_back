const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿処理
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (e) {
    console.log("post error");
    console.log(e);
    return res.status(500).json(e);
  }
});

//投稿内容を編集
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //編集したい投稿が自分の時のみ編集可能
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json("編集が完了しました");
    } else {
      //自分の投稿じゃない時
      console.log("post update error");
      return res.status(403).json("自分の投稿のみ編集が可能です");
    }
  } catch (e) {
    console.log("post update error");
    console.log(e);
    return res.status(403).json(e);
  }
});

//投稿内容を削除
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //編集したい投稿が自分の時のみ編集可能
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("削除が完了しました");
    } else {
      //自分の投稿じゃない時
      console.log("post delete error");
      return res.status(403).json("自分の投稿のみ削除が可能です");
    }
  } catch (e) {
    console.log("post delete error");
    console.log(e);
    return res.status(403).json(e);
  }
});

//特定の投稿を取得
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (e) {
    console.log("post find error");
    console.log(e);
    return res.status(403).json(e);
  }
});

//特定の投稿にいいねをする
router.put("/:id/like", async (req, res) => {
  try {
    // いいねをしたい投稿
    const post = await Post.findById(req.params.id);
    // 対象の投稿にいいねをしていない時のみいいねが可能
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿にいいねをしました");
    } else {
      //すでにいいねしている時の処理
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(403).json("いいねを外しました");
    }
  } catch (e) {
    console.log("likes error");
    console.log(e);
    return res.status(500).json(e);
  }
});

//自分がフォローしているユーザーの投稿を取得（タイムライン機能）
router.get("/timeline/all", async (req, res) => {
  try {
    //自分の投稿を取得
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    //自分がフォローしているユーザーの投稿を取得
    const friendsPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendsPosts))
  } catch (e) {
    console.log("timeline display error");
    console.log(e);
    return res.status(500).json(e);
  }
});

module.exports = router;
