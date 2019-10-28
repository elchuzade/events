import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventCard from './EventCard';

import { getEvents } from '../../actions/eventActions';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      events: []
    };
  }
  componentDidMount() {
    this.props.getEvents();
  }
  componentWillReceiveProps(nextProps) {
    // set errors
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    // Set events
    if (nextProps.event && nextProps.event.events) {
      this.setState({
        events: nextProps.event.events
      });
    }
  }
  render() {
    const { errors } = this.state;
    // const { isAuthenticated } = this.props.auth;
    const { events, loading } = this.props.event;
    let spinner = null;
    if (events === null || loading) {
      spinner = <div className="loader" />;
    } else {
      spinner = null;
    }
    return (
      <div>
        {spinner}
        {!spinner && (
          <div className="container pt-5">
            {this.state.events.length > 0 &&
              this.state.events.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
          </div>
        )}
      </div>
    );
  }
}

Event.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  getEvents: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  event: state.event
});

export default connect(
  mapStateToProps,
  {
    getEvents
  }
)(Events);
