const express = require('express');
const router = express.Router();
const passport = require('passport');
const Event = require('../../models/Event');
const Profile = require('../../models/Profile');
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

// @route POST api/event/
// @desc Create new event
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEvent(req.body);
    if (!isValid) return res.status(400).json(errors);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        let organizers = [];
        organizers.push({
          profile: profile._id
        });
        const newEvent = {
          title: req.body.title,
          category: req.body.category,
          user: req.user.id,
          organizers: organizers
        };
        new Event(newEvent)
          .save()
          .then(event => {
            let futureEvents = profile.futureEvents;
            futureEvents.push({ event: event._id });
            profile.futureEvents = futureEvents;
            profile
              .save()
              .then(profile => res.status(201).json(event))
              .catch(err => {
                errors.profile = 'Profile not saved';
                console.log(err);
                return res.status(400).json(errors);
              });
          })
          .catch(err => {
            errors.event = 'Event not saved';
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

module.exports = router;
