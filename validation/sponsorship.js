const Validator = require('validator');
const isEmpty = require('./is-empty');
const currencyList = require('./common/currencyList');

module.exports = function validateSponsorship(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.price = !isEmpty(data.price) ? data.price : '';
  data.maxCount = !isEmpty(data.maxCount) ? data.maxCount : '';
  data.currency = !isEmpty(data.currency) ? data.currency : '';

  if (Validator.isEmpty(data.title)) {
    errors.sponsorship = 'Title can not be empty';
  }
  if (!isEmpty(data.price) && !Validator.isFloat(data.price.toString())) {
    errors.price = 'Price is incorrect';
  }
  if (!isEmpty(data.maxCount) && !Validator.isInt(data.maxCount.toString())) {
    errors.maxCount = 'Max count is incorrect';
  }
  if (!isEmpty(data.currency) && currencyList.indexOf(data.currency) == -1) {
    errors.currency = 'Currency is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
