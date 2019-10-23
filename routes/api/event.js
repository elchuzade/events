const express = require('express');
const router = express.Router();
const passport = require('passport');
const Event = require('../../models/Event');
const Profile = require('../../models/Profile');
const validateEvent = require('../../validation/event');
const validateEventUpdate = require('../../validation/eventUpdate');
const validateGuest = require('../../validation/guest');

// AWS IMAGES
const aws = require('aws-sdk');
const config = require('../../config/keys');
const upload = require('../files');
const eventAvatar = upload.uploadEventAvatar.single('eventAvatar');
const guestAvatar = upload.uploadGuestAvatar.single('guestAvatar');

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

// @route POST api/event/id
// @desc Update event
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEventUpdate(req.body);
    if (!isValid) return res.status(400).json(errors);
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.status(401).json(errors);
        }
        if (req.body.title) event.title = req.body.title;
        if (req.body.category) event.category = req.body.category;
        if (req.body.intro) event.intro = req.body.intro;
        if (req.body.description) event.description = req.body.description;
        if (req.body.location) event.location = req.body.location;
        if (req.body.city) event.city = req.body.city;
        if (req.body.country) event.country = req.body.country;
        if (req.body.date) event.date = req.body.date;
        if (req.body.time) event.time = req.body.time;
        if (req.body.sits) event.sits = req.body.sits;
        if (req.body.price) event.price = req.body.price;
        event
          .save()
          .then(event => res.status(201).json(event))
          .catch(err => {
            errors.event = 'Event not saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.event = 'Event not found';
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

// @route POST api/event/id/guest
// @desc Add event guest
router.post(
  '/:id/guest',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateGuest(req.body);
    if (!isValid) return res.status(400).json(errors);
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.status(401).json(errors);
        }
        let guest = {
          name: req.body.name,
          title: req.body.title,
          intro: req.body.intro
        };
        event.guests.push(guest);
        event
          .save()
          .then(event => res.status(201).json(event))
          .catch(err => {
            errors.event = 'Event not saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.event = 'Event not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route PUT api/event/id/guest/guestId
// @desc Add event guest
router.put(
  '/:id/guest/:guestId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateGuest(req.body);
    if (!isValid) return res.status(400).json(errors);
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.status(401).json(errors);
        }
        for (let i = 0; i < event.guests.length; i++) {
          if (event.guests[i]._id.toString() === req.params.guestId){
            if (req.body.name) event.guests[i].name = req.body.name;
            if (req.body.title) event.guests[i].title = req.body.title;
            if (req.body.intro) event.guests[i].intro = req.body.intro;
            break;
          }
        }
        event
          .save()
          .then(event => res.status(201).json(event))
          .catch(err => {
            errors.event = 'Event not saved';
            console.log(err);
            return res.status(400).json(errors);
          });
      })
      .catch(err => {
        errors.event = 'Event not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/event/id/guest/guestId/avatar
// @desc Update event avatar
router.post(
  '/:id/guest/:guestId/avatar',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.json(errors);
        }
        let guest = event.guests.find(guest => guest._id.toString() === req.params.guestId);
        let params = {};
        if (guest.avatar && guest.avatar.key) {
          params = {
            Bucket: guest.avatar.bucket,
            Delete: {
              Objects: [{ Key: guest.avatar.key }]
            }
          };
        }
        if (params.Delete && params.Delete.Objects.length > 0) {
          s3.deleteObjects(params, (err, data) => {
            if (err) console.log(err);
          });
        }
        guestAvatar(req, res, err => {
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
          guest.avatar.location = req.file.location;
          guest.avatar.key = req.file.key;
          guest.avatar.bucket = req.file.bucket;
          guest.avatar.originalname = req.file.originalname;
          guest.avatar.mimetype = req.file.mimetype;
          guest.avatar.size = req.file.size;
          guest.avatar.fieldName = req.file.metadata.fieldName;
          for (let i = 0; i < event.guests.length; i++){
            if (event.guests[i]._id.toString() === guest._id) {
              event.guests[i] = guest;
              break;
            }
          }
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
