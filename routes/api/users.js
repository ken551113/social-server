const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const passport = require("../../config/passport");
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

router.get("/test",(req,res)=>{
  res.json({message: "test"});
});

// $route POST api/user/register
// @desc 用戶註冊
// @access public
router.post("/register",(req,res)=>{

  const {errors,isValid} = validateRegisterInput(req.body);
  // console.log(isValid);
  if(!isValid){
    console.log(errors);
    return res.status(400).json(errors);
  }
  User.findOne({email:req.body.email})
      .then((user)=>{
        if(user){
          return res.status(400).json({email:"郵箱已被註冊"});
        }else{
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(err) throw err
            newUser.password = hash;
            newUser.save()
                   .then(user => res.json(user))
                   .catch(err => console.log(err));
          });
        });
        } 
      })
})

// $route POST api/user/login
// @desc 用戶登陸
// @access public
router.post("/login",(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;

  const {errors, isValid} = validateLoginInput(req.body);
  if(!isValid){
    console.log(errors);
    return res.status(400).json(errors);
  }
  User.findOne({email:email})
      .then(user=>{
        if(!user){
          return res.status(404).json({email:"使用者不存在"})
        }
        bcrypt.compare(password, user.password)
              .then(isMatch => {
                if(isMatch){

                  const rule = {id:user.id,name:user.name}

                  jwt.sign(rule, process.env.PrivateKey, { expiresIn: 60*60 }, (err, token) => {
                    if(err) throw err;
                    res.json({
                      success:true,
                      token:"Bearer "+token
                    })
                  });
                }else{
                  return res.status(404).json({password:"密碼錯誤"});
                }
        });
      })
})


// $route GET api/user/current
// @desc 用戶驗證
// @access public

router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
  res.json({
    id:req.user.id,
    name:req.user.name
  })
})



module.exports = router;