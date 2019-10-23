const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateGuest(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
