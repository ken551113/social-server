const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data){

  let errors = {};


  if(!validator.isEmail(data.email)){
    errors.email = "您的信箱格式錯誤";
  }

  if(validator.isEmpty(data.email)){
    errors.email = "您的信箱不能為空";
  }

  if(!validator.isLength(data.password,{min:6,max:30})){
    errors.password = "您的密碼不能小於六個字並且不能大於30個字"
  }

  if(validator.isEmpty(data.password)){
    errors.password = "您的密碼不能為空"
  }

  return {
    errors,
    isValid:isEmpty(errors)
  }
}