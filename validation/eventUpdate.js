const Validator = require('validator');
const isEmpty = require('./is-empty');
const categoryList = require('./common/categoryList');
const hourList = require('./common/hourList');
const minuteList = require('./common/minuteList');

module.exports = function validateProfile(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.category = !isEmpty(data.category) ? data.category : '';
  data.intro = !isEmpty(data.intro) ? data.intro : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  data.date = !isEmpty(data.date) ? data.date : '';
  data.time = !isEmpty(data.time) ? data.time : '';
  data.sits = !isEmpty(data.sits) ? data.sits : '';
  data.price = !isEmpty(data.price) ? data.price : '';
  // time - 14:55, 23:05, 00:00
  let hour = data.time.split(':')[0];
  let minute = data.time.split(':')[1];

  if (
    !isEmpty(data.time) &&
    (hourList.indexOf(hour) == -1 || minuteList.indexOf(minute) == -1)
  ) {
    errors.time = 'Time is invalid';
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
  if (!isEmpty(data.price) && !Validator.isFloat(data.price.toString())) {
    errors.price = 'Price is incorrect';
  }
  if (!isEmpty(data.sits) && !Validator.isInt(data.sits.toString())) {
    errors.sits = 'Sits is incorrect';
  }
  // add date control
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
