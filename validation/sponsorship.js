const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateSponsorship(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.price = !isEmpty(data.price) ? data.price : '';

  if (Validator.isEmpty(data.title)) {
    errors.sponsorship = 'Sponsorship title can not be empty';
  }
  if (!isEmpty(data.price) && !Validator.isFloat(data.price.toString())) {
    errors.price = 'Sponsorship price is incorrect';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
