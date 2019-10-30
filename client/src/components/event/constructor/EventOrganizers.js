import React from 'react';
import PropTypes from 'prop-types';
import EventOrganizerCard from './EventOrganizerCard';

const EventOrganizers = ({ organizers }) => {
  return (
    <div className="container">
      <div className="row">
        {organizers.length > 0 &&
          organizers.map(organizer => (
            <EventOrganizerCard key={organizer._id} organizer={organizer.profile} />
          ))}
      </div>
    </div>
  );
};

EventOrganizers.propTypes = {
  organizers: PropTypes.array
};

export default EventOrganizers;
