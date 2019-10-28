import React from 'react';
import PropTypes from 'prop-types';

const EventTitle = ({ title }) => {
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-12">
        <h1 class="text-center">{title}</h1>
        </div>
      </div>
    </div>
  );
};

EventTitle.propTypes = {
  title: PropTypes.string
};

export default EventTitle;
