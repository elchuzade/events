const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateSponsorship(data) {
  let errors = {};

  data.sponsorship.title = !isEmpty(data.sponsorship.title)
    ? data.sponsorship.title
    : '';

  for (let i = 0; i < data.sponsorship.features.length; i++) {
    data.sponsorship.features[i].name = !isEmpty(
      data.sponsorship.features[i].name
    )
      ? data.sponsorship.features[i].name
      : '';
    if (Validator.isEmpty(data.sponsorship.features[i].name)) {
      errors.sponsorship = 'Sponsorship features can not be empty';
    }
  }

  if (Validator.isEmpty(data.sponsorship.title)) {
    errors.sponsorship = 'Sponsorship title can not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
