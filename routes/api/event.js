const express = require('express');
const router = express.Router();
const passport = require('passport');
const Event = require('../../models/Event');
const Profile = require('../../models/Profile');
const validateEvent = require('../../validation/event');
const validateEventUpdate = require('../../validation/eventUpdate');
const validateGuest = require('../../validation/guest');
const validateStatus = require('../../validation/status');

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
        if (profile.type !== "organizer") {
          errors.profile = "You must have an organizer account";
          return res.status(400).json(errors);
        }
        let organizers = [];
        organizers.push({
          profile: profile._id,
          status: 'admin'
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
            futureEvents.push({ event: event._id, status: 'admin' });
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
          if (event.guests[i]._id.toString() === req.params.guestId) {
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
// @desc Update event guest avatar
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
        let guest = event.guests.find(
          guest => guest._id.toString() === req.params.guestId
        );
        if (!guest) {
          errors.guest = 'Guest not found';
          return res.json(errors);
        }
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
          for (let i = 0; i < event.guests.length; i++) {
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

// @route DELETE api/event/id/guest/guestId
// @desc Delete event guest
router.delete(
  '/:id/guest/:guestId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.json(errors);
        }
        let guest = event.guests.find(
          guest => guest._id.toString() === req.params.guestId
        );
        if (!guest) {
          errors.guest = 'Guest not found';
          return res.json(errors);
        }
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
        event.guests = event.guests.filter(
          guest => guest._id.toString() != req.params.guestId
        );
        event
          .save()
          .then(event => res.status(201).json(event))
          .catch(err => {
            console.log(err);
            errors.event = 'Event not saved';
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

// @route POST api/event/id/organizer/
// @desc Add request to become event organizer
router.post(
  '/:id/organizer',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile.type !== "organizer") {
          errors.profile = "You must have an organizer account";
          return res.status(400).json(errors);
        }
        Event.findById(req.params.id)
          .then(event => {
            let organizer = event.organizers.find(
              organizer => organizer.profile === profile._id.toString()
            );
            if (organizer) {
              if (organizer.status === 'pending') {
                errors.organizer = 'Organizer request has already been sent';
              } else {
                errors.organizer = 'Organizer already exists';
              }
              return res.status(400).json(errors);
            }
            profile.futureEvents.push({
              event: event._id,
              message: req.body.message,
              status: 'pending'
            });
            profile
              .save()
              .then(profile => {
                event.organizers.push({
                  profile: profile._id,
                  message: req.body.message,
                  status: 'pending'
                });
                event
                  .save()
                  .then(event => res.status(201).json(event))
                  .catch(err => {
                    console.log(err);
                    errors.event = 'Event not saved';
                    return res.status(400).json(errors);
                  });
              })
              .catch(err => {
                console.log(err);
                errors.profile = 'Profile not saved';
                return res.status(400).json(errors);
              });
          })
          .catch(err => {
            errors.event = 'Event not found';
            console.log(err);
            return res.status(404).json(errors);
          });
      })
      .catch(err => {
        errors.profile = 'Profile not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/event/id/organizer/organizerId
// @desc Accept request to become event organizer
router.post(
  '/:id/organizer/:organizerId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateStatus(req.body);
    if (!isValid) return res.status(400).json(errors);
    Profile.findById(req.params.organizerId)
      .then(profile => {
        Event.findById(req.params.id)
          .then(event => {
            if (event.user !== req.user.id) {
              errors.authorization = 'Not authorized';
              return res.status(401).json(errors);
            }
            for (let i = 0; i < profile.futureEvents.length; i++) {
              if (
                profile.futureEvents[i].event === req.params.id &&
                profile.futureEvents[i].status === 'pending'
              ) {
                profile.futureEvents[i].status = req.body.status;
              }
            }
            for (let i = 0; i < event.organizers.length; i++) {
              if (
                event.organizers[i].profile === req.params.organizerId &&
                event.organizers[i].status === 'pending'
              ) {
                event.organizers[i].status = req.body.status;
              }
            }
            profile
              .save()
              .then(profile => {
                event
                  .save()
                  .then(event => res.status(201).json(event))
                  .catch(err => {
                    console.log(err);
                    errors.event = 'Event not saved';
                    return res.status(400).json(errors);
                  });
              })
              .catch(err => {
                console.log(err);
                errors.profile = 'Profile not saved';
                return res.status(400).json(errors);
              });
          })
          .catch(err => {
            errors.event = 'Event not found';
            console.log(err);
            return res.status(404).json(errors);
          });
      })
      .catch(err => {
        errors.profile = 'Profile not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route DELETE api/event/id/organizer/organizerId
// @desc Remove event organizer
router.delete(
  '/:id/organizer/:organizerId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.status(401).json(errors);
        }
        if (event.organizers.length <= 1) {
          errors.event = 'Event must have at least one organizer';
          return res.status(400).json(errors);
        }
        let organizer = event.organizers.find(
          organizer => organizer.profile === req.params.organizerId
        );
        if (!organizer) {
          errors.organizer = 'Organizer not found';
          return res.status(404).json(errors);
        }
        Profile.findById(req.params.organizerId)
          .then(profile => {
            let futureEvent = profile.futureEvents.find(
              event => event.event === req.params.id
            );
            if (!futureEvent) {
              errors.profile = 'Event not found';
              return res.status(404).json(errors);
            }
            profile.futureEvents = profile.futureEvents.filter(
              event => event.event != req.params.id
            );
            profile
              .save()
              .then(profile => {
                event.organizers = event.organizers.filter(
                  organizer => organizer.profile != req.params.organizerId
                );
                event
                  .save()
                  .then(event => res.status(201).json(event))
                  .catch(err => {
                    console.log(err);
                    errors.event = 'Event not saved';
                    return res.status(400).json(errors);
                  });
              })
              .catch(err => {
                console.log(err);
                errors.profile = 'Profile not saved';
                return res.status(400).json(errors);
              });
          })
          .catch(err => {
            errors.profile = 'Profile not found';
            console.log(err);
            return res.status(404).json(errors);
          });
      })
      .catch(err => {
        errors.event = 'Event not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/event/id/sponsor/
// @desc Add request to become event sponsor
router.post(
  '/:id/sponsor',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile.type !== "sponsor") {
          errors.profile = "You must have a sponsor account";
          return res.status(400).json(errors);
        }
        Event.findById(req.params.id)
          .then(event => {
            let sponsor = event.sponsors.find(
              sponsor => sponsor.profile === profile._id.toString()
            );
            if (sponsor) {
              if (sponsor.status === 'pending') {
                errors.sponsor = 'Sponsor request has already been sent';
              } else {
                errors.sponsor = 'Sponsor already exists';
              }
              return res.status(400).json(errors);
            }
            profile.futureEvents.push({
              event: event._id,
              message: req.body.message,
              status: 'pending'
            });
            profile
              .save()
              .then(profile => {
                event.sponsors.push({
                  profile: profile._id,
                  message: req.body.message,
                  status: 'pending'
                });
                event
                  .save()
                  .then(event => res.status(201).json(event))
                  .catch(err => {
                    console.log(err);
                    errors.event = 'Event not saved';
                    return res.status(400).json(errors);
                  });
              })
              .catch(err => {
                console.log(err);
                errors.profile = 'Profile not saved';
                return res.status(400).json(errors);
              });
          })
          .catch(err => {
            errors.event = 'Event not found';
            console.log(err);
            return res.status(404).json(errors);
          });
      })
      .catch(err => {
        errors.profile = 'Profile not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route POST api/event/id/sponsor/sponsorId
// @desc Accept request to become event sponsor
router.post(
  '/:id/sponsor/:sponsorId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateStatus(req.body);
    if (!isValid) return res.status(400).json(errors);
    Profile.findById(req.params.sponsorId)
      .then(profile => {
        Event.findById(req.params.id)
          .then(event => {
            if (event.user !== req.user.id) {
              errors.authorization = 'Not authorized';
              return res.status(401).json(errors);
            }
            for (let i = 0; i < profile.futureEvents.length; i++) {
              if (
                profile.futureEvents[i].event === req.params.id &&
                profile.futureEvents[i].status === 'pending'
              ) {
                profile.futureEvents[i].status = req.body.status;
              }
            }
            for (let i = 0; i < event.sponsors.length; i++) {
              if (
                event.sponsors[i].profile === req.params.sponsorId &&
                event.sponsors[i].status === 'pending'
              ) {
                event.sponsors[i].status = req.body.status;
              }
            }
            profile
              .save()
              .then(profile => {
                event
                  .save()
                  .then(event => res.status(201).json(event))
                  .catch(err => {
                    console.log(err);
                    errors.event = 'Event not saved';
                    return res.status(400).json(errors);
                  });
              })
              .catch(err => {
                console.log(err);
                errors.profile = 'Profile not saved';
                return res.status(400).json(errors);
              });
          })
          .catch(err => {
            errors.event = 'Event not found';
            console.log(err);
            return res.status(404).json(errors);
          });
      })
      .catch(err => {
        errors.profile = 'Profile not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

// @route GET api/event
// @desc Get all events
router.get('/', (req, res) => {
  Event.find()
    .then(events => res.status(201).json(events))
    .catch(err => {
      errors.events = 'Events not found';
      console.log(err);
      return res.status(404).json(errors);
    });
});

// @route GET api/event/id
// @desc Get all events
router.get('/:id', (req, res) => {
  Event.findById(req.params.id)
    .then(event => res.status(201).json(event))
    .catch(err => {
      errors.event = 'Event not found';
      console.log(err);
      return res.status(404).json(errors);
    });
});

// @route POST api/event/id/sponsorship
// @desc Add new sponsorship package
router.post(
  '/:id/sponsorship',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateSponsorship(req.body);
    if (!isValid) return res.status(400).json(errors);
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.status(401).json(errors);
        }
        event.sponsorships.push({
          title: req.body.title,
          features: req.body.features
        });
        event
          .save()
          .then(event => res.status(201).json(event))
          .catch(err => {
            console.log(err);
            errors.event = 'Event not saved';
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

// @route DELETE api/event/id/sponsorship/sponsorshipId
// @desc Remove sponsorship package
router.delete(
  '/:id/sponsorship/:sponsorshipId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateSponsorship(req.body);
    if (!isValid) return res.status(400).json(errors);
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.status(401).json(errors);
        }
        event.sponsorships = event.sponsorships.filter(
          sponsorship => sponsorship._id != req.params.sponsorshipId
        );
        event
          .save()
          .then(event => res.status(201).json(event))
          .catch(err => {
            console.log(err);
            errors.event = 'Event not saved';
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

// @route PUT api/event/id/sponsorship/sponsorshipId
// @desc Update sponsorship package
router.put(
  '/:id/sponsorship/:sponsorshipId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateSponsorship(req.body);
    if (!isValid) return res.status(400).json(errors);
    Event.findById(req.params.id)
      .then(event => {
        if (event.user !== req.user.id) {
          errors.authorization = 'Not authorized';
          return res.status(401).json(errors);
        }
        for (let i = 0; i < event.sponsorships.length; i++) {
          if (event.sponsorships[i]._id === req.params.sponsorshipId) {
            event.sponsorships[i].title = req.body.title;
            event.sponsorships[i].features = req.body.features;
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
      })
      .catch(err => {
        errors.event = 'Event not found';
        console.log(err);
        return res.status(404).json(errors);
      });
  }
);

module.exports = router;
