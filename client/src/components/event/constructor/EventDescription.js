import React from 'react';
import PropTypes from 'prop-types';

const EventDescription = ({ description }) => {
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-12">
          <p
            className="text-center"
            dangerouslySetInnerHTML={{
              __html: description
            }}
          ></p>
        </div>
      </div>
    </div>
  );
};

EventDescription.propTypes = {
  description: PropTypes.string
};

export default EventDescription;
