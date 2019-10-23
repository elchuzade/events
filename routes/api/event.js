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

// @route POST api/event/id/avatar
// @desc Update event avatar
router.post(
  '/:id/avatar',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.json(errors);
        }
        let params = {};
        if (event.avatar && event.avatar.key) {
          params = {
            Bucket: event.avatar.bucket,
            Delete: {
              Objects: [{ Key: event.avatar.key }]
            }
          };
        }
        if (params.Delete && params.Delete.Objects.length > 0) {
          s3.deleteObjects(params, (err, data) => {
            if (err) console.log(err);
          });
        }
        eventAvatar(req, res, err => {
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
          event.avatar.location = req.file.location;
          event.avatar.key = req.file.key;
          event.avatar.bucket = req.file.bucket;
          event.avatar.originalname = req.file.originalname;
          event.avatar.mimetype = req.file.mimetype;
          event.avatar.size = req.file.size;
          event.avatar.fieldName = req.file.metadata.fieldName;
          event
            .save()
            .then(event => res.status(201).json(event))
            .catch(err => {
              console.log(err);
              errors.event = 'Event not saved';
              return res.status(400).json(errors);
            });
        });
      })
      .catch(err => {
        errors.event = 'Event not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

module.exports = router;
