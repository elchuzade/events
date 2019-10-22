const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');

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

router.post('/', passport.authenticate('jwt', { session: false }),
(req, res) => {
  const { errors, isValid } = validateProfile(req.body);
  if (!isValid) return res.status(400).json(errors);
  
})