const express = require('express');
const router = express.Router();
const passport = require('passport');
const Event = require('../../models/Event');
const validateEvent = require('../../validation/event');

// AWS IMAGES
const aws = require('aws-sdk');
const config = require('../../config/keys');
const upload = require('../files');
const eventAvatar = upload.uploadEventAvatar.single('eventAvatar');

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  region: 'eu-central-1'
});

const s3 = new aws.S3();



module.exports = router;