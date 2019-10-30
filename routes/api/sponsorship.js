const express = require('express');
const router = express.Router();
const passport = require('passport');
const Event = require('../../models/Event');
const Sponsorship = require('../../models/Sponsorship');
const Profile = require('../../models/Profile');
const validateSponsorship = require('../../validation/sponsorship');


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
          price: req.body.price,
          description: req.body.description
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
            event.sponsorships[i].price = req.body.price;
            event.sponsorships[i].description = req.body.description;
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
