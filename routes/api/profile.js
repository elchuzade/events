const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const validateProfile = require('../../validation/profile');

// AWS IMAGES
const aws = require('aws-sdk');
const config = require('../../config/keys');
const upload = require('../files');
const profileAvatar = upload.uploadProfileAvatar.single('profileAvatar');

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'eu-central-1'
});

const s3 = new aws.S3();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfile(req.body);
    if (!isValid) return res.status(400).json(errors);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (req.body.title) profile.title = req.body.title;
        if (req.body.intro) profile.intro = req.body.intro;
        if (req.body.city) profile.city = req.body.city;
        if (req.body.country) profile.country = req.body.country;
        if (req.body.email) profile.email = req.body.email;
        if (req.body.facebook) profile.facebook = req.body.facebook;
        if (req.body.twitter) profile.twitter = req.body.twitter;
        if (req.body.instagram) profile.instagram = req.body.instagram;
        if (req.body.linkedin) profile.linkedin = req.body.linkedin;
        if (req.body.phone) profile.phone = req.body.phone;
        profile
          .save()
          .then(profile => res.status(201).json(profile))
          .catch(err => {
            errors.profile = 'Profile can not be saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.profile = 'Profile not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);
