const User = require("../models/User");
const router = require("express").Router();

// CRUD処理
//ユーザー情報更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザー情報が更新されました。");
    } catch (e) {
      console.log("update error");
      console.log(e);
      return res.status(500).json(e);
    }
  } else {
    return res
      .status(403)
      .json("本人、もしくは管理者のみが情報を更新できます。");
  }
});

//ユーザー情報削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザー情報が削除されました。");
    } catch (e) {
      console.log("delete error");
      console.log(e);
      return res.status(500).json(e);
    }
  } else {
    return res
      .status(403)
      .json("本人、もしくは管理者のみが情報を削除できます。");
  }
});
//ユーザー情報取得
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (e) {
    console.log("delete error");
    console.log(e);
    return res.status(500).json(e);
  }
});

//ユーザーフォロー機能
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      // 相手の情報
      const user = await User.findById(req.params.id);
      //自分の情報
      const currentUser = await User.findById(req.body.userId);
      // 対象のユーザーが自分をフォローしていない時、フォロー可能にする
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json('フォローしました。')
      } else {
        //すでにフォローされている時の処理
        return res.status(403).json('すでにフォローしています。')
      }
    } catch (e) {
      console.log("follow error");
      console.log(e);
      return res.status(500).json(e);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません...");
  }
});

//ユーザーのフォロー解除
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        // 相手の情報
        const user = await User.findById(req.params.id);
        //自分の情報
        const currentUser = await User.findById(req.body.userId);
        // 対象のユーザーのフォロワーに自分が存在している時のみフォロー解除が可能
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({
            $pull: {
              followers: req.body.userId,
            },
          });
          await currentUser.updateOne({
            $pull: {
              followings: req.params.id,
            },
          });
          return res.status(200).json('フォロー解除しました')
        } else {
          //すでにフォローされている時の処理
          return res.status(403).json('このユーザーはフォロー解除できません')
        }
      } catch (e) {
        console.log("unfollow error");
        console.log(e);
        return res.status(500).json(e);
      }
    } else {
      return res.status(500).json("自分自身はフォロー解除できません...");
    }
  });

module.exports = router;
