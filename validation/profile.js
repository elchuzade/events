const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfile(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.intro = !isEmpty(data.intro) ? data.intro : '';
  data.city = !isEmpty(data.city) ? data.city : '';
  data.country = !isEmpty(data.country) ? data.country : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.facebook = !isEmpty(data.facebook) ? data.facebook : '';
  data.twitter = !isEmpty(data.twitter) ? data.twitter : '';
  data.instagram = !isEmpty(data.instagram) ? data.instagram : '';
  data.linkedin = !isEmpty(data.linkedin) ? data.linkedin : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (!isEmpty(data.email) && !Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (!isEmpty(data.facebook) && !Validator.isURL(data.facebook)) {
    errors.facebook = 'Facebook link is incorrect';
  }
  if (!isEmpty(data.twitter) && !Validator.isURL(data.twitter)) {
    errors.twitter = 'Twitter link is incorrect';
  }
  if (!isEmpty(data.instagram) && !Validator.isURL(data.instagram)) {
    errors.instagram = 'Instagram link is incorrect';
  }
  if (!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)) {
    errors.linkedin = 'Linkedin link is incorrect';
  }
  if (!isEmpty(data.phone) && !Validator.isMobilePhone(data.phone)) {
    errors.phone = 'Phone is incorrect';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
