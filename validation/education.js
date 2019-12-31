const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateEducationInput(data){

  let errors = {};

  if(validator.isEmpty(data.school)){
    errors.school = "你的school不得為空！";
  }


  if(validator.isEmpty(data.degree)){
    errors.degree = "你的degree不能為空！";
  }

  if(validator.isEmpty(data.fieldofstudy)){
    errors.fieldofstudy = "你的fieldofstudy不能為空！";
  }


  if(validator.isEmpty(data.from)){
    errors.from = "你的from不能為空！";
  }


  return {
    errors,
    isValid:isEmpty(errors)
  }
}