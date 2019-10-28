import React from 'react';
import PropTypes from 'prop-types';

const SectionHeader = ({ header }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h3 className="text-center my-5">{header}</h3>
        </div>
      </div>
    </div>
  );
};

SectionHeader.propTypes = {
  header: PropTypes.string.isRequired
};

export default SectionHeader;
