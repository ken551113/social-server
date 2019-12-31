const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/posts");

const validatePostInput = require("../../validation/post");

// $route Get api/posts/test
// @desc 測試
// @access public
router.get("/test",(req,res)=>{
  res.json({message: "posts 測試成功"});
});


// $route Post api/posts/
// @desc 新增評論
// @access private
router.post("/",passport.authenticate("jwt",{session:false}),(req,res)=>{

  const {errors,isValid} = validatePostInput(req.body);
  if(!isValid){
    return res.status(404).json(errors);
  }

  const newPost = new Post({
    user: req.user.id,
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
  })

  newPost.save().then(post => res.json(post));

});

// $route GET api/posts
// @desc 獲取全部評論
// @access public
router.get("/",(req,res)=>{
  Post.find()
      .sort({data:-1})
      .then(posts =>{
        res.json(posts)
        }
      )
      .catch(err => res.status(404).json({nopostfound:"找不到評論信息"}));
});

// $route GET api/posts/:post_id
// @desc 獲取單個評論信息
// @access public
router.get("/:post_id",(req,res)=>{
  Post.findById(req.params.post_id)
      .then(post =>{
        res.json(post)
        }
      )
      .catch(err => res.status(404).json({nopostfound:"找不到評論信息"}));
});

// $route DELETE api/posts/:post_id
// @desc 刪除單個評論信息
// @access public{
router.delete("/:post_id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Profile.findOne({user:req.user.id})
         .then(profile =>{
          Post.findById(req.params.post_id)
              .then(post =>{
                if(post.user.toString()!== req.user.id){
                  return res.status(401).json({notAuthorized:"用戶非法操作"})
                }
                post.remove().then(()=>res.json({success:true}));
              })
              .catch(err => res.status(404).json({postnotfound:"沒有評論信息"}))
         })
});


// $route Post api/posts/like/:post_id
// @desc 點讚
// @access private
router.post("/like/:post_id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Profile.find({user:req.user.id})
         .then(profile => {
          Post.findById(req.params.post_id)
              .then(post =>{
                if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                  return res.status(404).json({alreadyliked:"該用戶已點讚過"});
                }
                post.likes.unshift({user:req.user.id});
                post.save().then(post => res.json(post));
              })
         })
         .catch(err=>res.status(404).json({likederror:"點讚錯誤"}));
});


// $route Post api/posts/unlike/:post_id
// @desc 取消點讚
// @access private
router.post("/unlike/:post_id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Profile.find({user:req.user.id})
         .then(profile => {
          Post.findById(req.params.post_id)
              .then(post =>{
                if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                  return res.status(404).json({alreadyliked:"該用戶沒點過讚"});
                }
                const removeIndex = post.likes.map(item => item.id).indexOf(req.user.id);
                post.likes.splice(removeIndex,1);
                post.save().then(post => res.json(post));
              })
         })
         .catch(err=>res.status(404).json({likederror:"取消點讚錯誤"}));
});


// $route Post api/posts/comment/:post_id
// @desc 添加評論接口
// @access private
router.post("/comment/:post_id",passport.authenticate("jwt",{session:false}),(req,res)=>{

  const {errors,isValid} = validatePostInput(req.body);
  if(!isValid){
    return res.status(404).json(errors);
  }

  Post.findById(req.params.post_id)
      .then(post=>{
        const newComment = {
          user: req.user.id,
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar, 
        }
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({postnotfound: "添加評論錯誤"}))
});


// $route DELETE api/posts/comment/:post_id/:comment_id
// @desc 刪除評論接口
// @access private
router.delete("/comment/:post_id/:comment_id",passport.authenticate("jwt",{session:false}),(req,res)=>{

  Post.findById(req.params.post_id)
      .then(post=>{
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length ===0){
          return res.status(404).json({commentnotexists:"該評論不存在"})
        }
        const removeIndex = post.comments.map(comment=>comment._id).indexOf(req.params.comment_id);
        post.comments.splice(removeIndex,1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({postnotfound: "添加評論錯誤"}))
});


module.exports = router;