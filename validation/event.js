const Validator = require('validator');
const isEmpty = require('./is-empty');
const categoryList = require('./categoryList');

module.exports = function validateProfile(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.category = !isEmpty(data.category) ? data.category : '';

  if (typeof data.title != 'string' || typeof data.category != 'string') {
    errors.input = 'Wrong input type';
  }

  if (categoryList.indexOf(data.category) == -1) {
    errors.category = 'Category is invalid';
  }
  if (Validator.isEmpty(data.category)) {
    errors.category = 'Category can not be empty';
  }
  if (Validator.isEmpty(data.title)) {
    errors.title = 'Title can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
