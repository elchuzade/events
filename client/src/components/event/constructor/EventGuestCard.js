import React from 'react';
import PropTypes from 'prop-types';

const EventGuestCard = ({ guest }) => {
  return (
    <div className="col-3">
      <div className="card myCard p-3">
        <img
          src={
            guest.avatar
              ? guest.avatar.location
              : 'https://picsum.photos/600?random=1'
          }
          className="card-img-top rounded-circle"
          alt="ava1"
        />
        <div className="card-body px-1 text-center">
          <h4>{guest.name}</h4>
          <p className="lead my-0 text-secondary">
            <i>{guest.title}</i>
          </p>
          <p className="card-text">{guest.intro}</p>
        </div>
      </div>
    </div>
  );
};

EventGuestCard.propTypes = {
  guest: PropTypes.object.isRequired
};

export default EventGuestCard;
