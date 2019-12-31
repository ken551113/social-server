const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data){

  let errors = {};

  if(!validator.isLength(data.handle,{min:2,max:40})){
    errors.name = "使用者名稱不能小於兩個字並且不能大於四十個字";
  }

  if(validator.isEmpty(data.handle)){
    errors.handle = "handle不得為空！"
  }


  if(validator.isEmpty(data.status)){
    errors.status = "您的職業不能為空";
  }

  if(validator.isEmpty(data.skills)){
    errors.skills = "您的技能不能為空"
  }

  if(!isEmpty(data.website)){
    if(!validator.isURL(data.website)){
      errors.website = "個人網站格式錯誤"
    }
  }

  return {
    errors,
    isValid:isEmpty(errors)
  }
}