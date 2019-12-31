const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data){

  let errors = {};

  if(!validator.isLength(data.name,{min:2,max:30})){
    errors.name = "您的名字不能小於兩個字並且不能大於30個字";
  }

  if(validator.isEmpty(data.name)){
    errors.name = "您的名字不能為空";
  }

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

  if(!validator.isLength(data.password2,{min:6,max:30})){
    errors.password2 = "您的確認密碼不能小於六個字並且不能大於30個字"
  }

  if(validator.isEmpty(data.password2)){
    errors.password2 = "您的確認密碼不能為空"
  }

  if(!validator.equals(data.password,data.password2)){
    errors.password2 = "密碼不相同"
  }

  return {
    errors,
    isValid:isEmpty(errors)
  }
}