const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validatePostInput(data){

  let errors = {};

  data.text = !isEmpty(data.text)? data.text: "";

  if(!validator.isLength(data.text,{min:10,max:300})){
    errors.text = "評論不得小於10個字，大於300個字";
  }

  if(validator.isEmpty(data.text)){
    errors.text = "評論不得為空！"
  }

  return {
    errors,
    isValid:isEmpty(errors)
  }
}