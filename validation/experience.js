const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateExperienceInput(data){

  let errors = {};

  if(validator.isEmpty(data.title)){
    errors.title = "你的title不得為空！";
  }


  if(validator.isEmpty(data.company)){
    errors.company = "你的company不能為空！";
  }

  if(validator.isEmpty(data.from)){
    errors.from = "你的from不能為空！";
  }


  return {
    errors,
    isValid:isEmpty(errors)
  }
}