import React from 'react';
import PropTypes from 'prop-types';

const EventOrganizerCard = ({ organizer }) => {
  return (
    <div className="col-2">
      <div className="card myCard p-3">
        <a href="./organizer.html">
          <img
            src={
              organizer.avatar
                ? organizer.avatar.location
                : 'https://picsum.photos/600?random=1'
            }
            className="card-img-top rounded-circle"
            alt="ava1"
          />
        </a>
        <div className="card-body px-1 text-center">
          <h4>{organizer.name}</h4>
          <p className="lead my-0 text-secondary">
            <i>{organizer.title}</i>
          </p>
        </div>
      </div>
    </div>
  );
};

EventOrganizerCard.propTypes = {
  organizer: PropTypes.object.isRequired
};

export default EventOrganizerCard;
