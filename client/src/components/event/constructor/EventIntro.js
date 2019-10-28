import React from 'react';
import PropTypes from 'prop-types';

const EventIntro = ({ intro }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mt-2">
          <p className="lead text-center">
            {intro}
          </p>
        </div>
      </div>
    </div>
  );
};

EventIntro.propTypes = {
  intro: PropTypes.string
};

export default EventIntro;
