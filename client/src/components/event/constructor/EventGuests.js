import React from 'react';
import PropTypes from 'prop-types';
import EventGuestCard from './EventGuestCard';

const EventGuests = ({ guests }) => {
  return (
    <div className="container">
      <div className="row">
        {guests.length > 0 &&
          guests.map(guest => (
            <EventGuestCard key={guest._id} guest={guest} />
          ))}
      </div>
    </div>
  );
};

EventGuests.propTypes = {
  guests: PropTypes.array
};

export default EventGuests;
