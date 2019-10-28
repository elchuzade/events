import React from 'react';
import PropTypes from 'prop-types';

const EventCover = ({ avatar, category }) => {
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-12">
          <img
            src={avatar ? avatar.location : 'https://picsum.photos/1200/400'}
            className="img-fluid"
            alt="img1"
          />
          <div className="bg-dark eventCategory px-4 py-2">
            <p className="mb-0 text-center text-light lead">
              <b>{category}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

EventCover.propTypes = {
  avatar: PropTypes.object,
  category: PropTypes.string.isRequired
};

export default EventCover;
