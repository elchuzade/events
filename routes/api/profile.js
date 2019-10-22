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

// @route POST api/profile/
// @desc Update profile information
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfile(req.body);
    if (!isValid) return res.status(400).json(errors);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const oldProfile = profile;
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
        if (oldProfile === profile) {
          return res.status(201).json(profile);
        } else {
          profile
            .save()
            .then(profile => res.status(201).json(profile))
            .catch(err => {
              errors.profile = 'Profile can not be saved';
              console.log(err);
              return res.status(400).json(errors);
            });
        }
      })
      .catch(err => {
        errors.profile = 'Profile not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/profile/avatar
// @desc Update profile avatar
router.post(
  '/avatar',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        let params = {};
        if (profile.avatar && profile.avatar.key) {
          params = {
            Bucket: profile.avatar.bucket,
            Delete: {
              Objects: [{ Key: profile.avatar.key }]
            }
          };
        }
        if (params.Delete && params.Delete.Objects.length > 0) {
          s3.deleteObjects(params, (err, data) => {
            if (err) console.log(err);
          });
        }
        profileAvatar(req, res, err => {
          if (err) {
            console.log(err);
            errors.uploadfail = 'Failed to upload an image';
            return res.json(errors);
          }
          if (req.file == undefined) {
            console.log(err);
            errors.selectfail = 'No file selected';
            return res.json(errors);
          }
          profile.avatar.location = req.file.location;
          profile.avatar.key = req.file.key;
          profile.avatar.bucket = req.file.bucket;
          profile.avatar.originalname = req.file.originalname;
          profile.avatar.mimetype = req.file.mimetype;
          profile.avatar.size = req.file.size;
          profile.avatar.fieldName = req.file.metadata.fieldName;
          profile
            .save()
            .then(profile => res.status(201).json(profile))
            .catch(err => {
              console.log(err);
              errors.profile = 'Profile can not saved';
              return res.status(400).json(errors);
            });
        });
      })
      .catch(err => {
        errors.profile = 'Profile not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route GET api/profile/
// @desc Get my profile
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => res.status(201).json(profile))
      .catch(err => {
        errors.profile = 'Profile not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

module.exports = router;
