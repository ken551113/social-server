const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// $route Get api/profile/test
// @desc 測試
// @access public
router.get("/test",(req,res)=>{
  res.json({message: "profile 測試成功"});
});


// $route Get api/profile
// @desc 拿到使用者的profile
// @access private
router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
  const errors = {};
  Profile.findOne({user:req.user.id})
      .populate("user",["name","avatar"])
      .then((profile)=>{
        if(!profile){
          errors.noprofile = "該用戶信息不存在";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err=>res.status(404).json(err));
});

// $route Post api/profile
// @desc 創建或更新使用者profile
// @access private
router.post("/",passport.authenticate("jwt",{session:false}),(req,res)=>{

  const {errors,isValid} = validateProfileInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  const profileFields = {};
  profileFields.user = req.user.id;

  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  
  if(typeof req.body.skills !== "undefined"){
    profileFields.skills = req.body.skills.split(",");
  }

  profileFields.social = {};

  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

  Profile.findOne({user:req.user.id})
      .then((profile)=>{
        if(profile){
          Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true})
                 .then(Profile => res.json(profile))
                 .catch(error => console.log(error));
        }else{
          console.log(profileFields);
          //用戶信息不存在,執行創建方法
          Profile.findOne({handle:profileFields.handle}).then(profile => {
            if(profile){
              errors.handle = "該用戶的個人信息已經存在，請勿重新創建";
              return res.status(400).json(errors);
            }else{
              new Profile(profileFields).save().then(profile => res.json(profile));
            }
          })
        }
      })
});


// $route Get api/profile/handle/:handle
// @desc 透過handle獲取用戶個人訊息
// @access public
router.get("/handle/:handle",(req,res)=>{
  const errors={};

  Profile.findOne({handle:req.params.handle})
         .populate("user",["name","avatar"])
         .then(profile=>{
            if(!profile){
              errors.noprofile = "沒有此用戶個人信息";
              return res.state(404).json(errors);
            }
            res.json(profile);
         })
         .catch(err => res.status(404).json(err));
 
});


// $route Get api/profile/user/:user_id
// @desc 透過user獲取用戶個人訊息
// @access public
router.get("/user/:user_id",(req,res)=>{
  const errors={};

  Profile.findOne({user:req.params.user_id})
         .populate("user",["name","avatar"])
         .then(profile=>{
            if(!profile){
              errors.noprofile = "沒有此用戶個人信息";
              return res.state(404).json(errors);
            }
            res.json(profile);
         })
         .catch(err => res.status(404).json(err));
 
});


// $route Get api/profile/all
// @desc 透過all獲取所有用戶信息
// @access public
router.get("/all",(req,res)=>{
  const errors={};

  Profile.find()
         .populate("user",["name","avatar"])
         .then(profiles=>{
            if(!profiles){
              errors.noprofile = "沒有任何用戶信息";
              return res.state(404).json(errors);
            }
            res.json(profiles);
         })
         .catch(err => res.status(404).json(err));
 
});


// $route Post api/profile/experience
// @desc 新增工作經歷
// @access private
router.post("/experience",passport.authenticate("jwt",{session:false}),(req,res)=>{

  const {errors,isValid} = validateExperienceInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user:req.user.id})
         .then(profile => {
          const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            description: req.body.description,
            current: req.body.current
          }
          profile.experience.unshift(newExp);
          profile.save().then(profile=>res.json(profile));
         })
});

// $route Post api/profile/education
// @desc 新增學歷
// @access private
router.post("/education",passport.authenticate("jwt",{session:false}),(req,res)=>{

  const {errors,isValid} = validateEducationInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user:req.user.id})
         .then(profile => {
          const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            description: req.body.description,
            current: req.body.current
          }
          profile.education.unshift(newEdu);
          profile.save().then(profile=>res.json(profile));
         })
});


// $route DELETE api/profile/experience/:exp_id
// @desc 刪除個人經歷
// @access private

router.delete("/experience/:exp_id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Profile.findOne({user:req.user.id})
         .then(profile =>{
            const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
            profile.experience.splice(removeIndex,1);
            profile.save().then(profile => res.json(profile));
         })
         .catch(err => res.status(404).json(err));
})

// $route DELETE api/profile/education/:edu_id
// @desc 刪除個人學歷
// @access private

router.delete("/education/:edu_id",passport.authenticate("jwt",{session:false}),(req,res)=>{
  console.log("delete education");
  Profile.findOne({user:req.user.id})
         .then(profile =>{
            const removeIndex = profile.education
                                       .map(item=>item.id)
                                       .indexOf(req.params.edu_id);
            profile.education.splice(removeIndex,1);           
            profile.save().then(profile => res.json(profile));
         })
         .catch(err => res.status(404).json(err));
})


// $route DELETE api/profile
// @desc 刪除個人資料
// @access private
router.delete("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
  Profile.findOneAndRemove({user:req.user.id})
         .then(() =>{
          User.findOneAndRemove({_id:req.user.id})
              .then(()=>{
                res.json({success:true});
              }) 
         })
})

module.exports = router;