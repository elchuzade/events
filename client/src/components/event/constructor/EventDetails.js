import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const EventDetails = ({
  location,
  city,
  country,
  date,
  time,
  sits,
  price,
  currency
}) => {
  return (
    <div className="container">
      <div className="row w-100 text-center border mt-3">
        <div className="col-12 border-bottom">
          <p className="py-1 my-1">
            {location}, {city} / {country}
          </p>
        </div>
        <div className="col-3 border-right">
          <p className="py-1 my-1">
            <Moment format="D MMM YYYY" withTitle>
              {date}
            </Moment>
          </p>
        </div>
        <div className="col-3 border-right">
          <p className="py-1 my-1">{time}</p>
        </div>
        <div className="col-3 border-right">
          <p className="py-1 my-1">{sits} sits</p>
        </div>
        <div className="col-3">
          <p className="py-1 my-1">
            {price} {currency}
          </p>
        </div>
      </div>
    </div>
  );
};

EventDetails.propTypes = {
  location: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  sits: PropTypes.number,
  price: PropTypes.number,
  currency: PropTypes.string
};

export default EventDetails;
