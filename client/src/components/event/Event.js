import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EventCover from './constructor/EventCover';
import EventTitle from './constructor/EventTitle';
import EventIntro from './constructor/EventIntro';
import EventDescription from './constructor/EventDescription';
import EventDetails from './constructor/EventDetails';
// import EventGuest from './constructor/EventGuest';

import SectionHeader from '../common/SectionHeader';
import { getEvent } from '../../actions/eventActions';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      event: {}
    };
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getEvent(this.props.match.params.id);
    }
  }
  componentWillReceiveProps(nextProps) {
    // set errors
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    // Set events
    if (nextProps.event && nextProps.event.event) {
      this.setState({
        event: nextProps.event.event
      });
    }
  }
  render() {
    const { errors } = this.state;
    // const { isAuthenticated } = this.props.auth;
    const { event, loading } = this.props.event;
    let spinner = null;
    if (event === null || loading) {
      spinner = <div className="loader" />;
    } else {
      spinner = null;
    }
    return (
      <div>
        {spinner}
        {!spinner && (
          <div>
            <section id="eventCover">
              <EventCover
                event={this.state.event.avatar}
                category={this.state.event.category}
              />
            </section>
            <section id="eventTitle">
              <EventTitle title={this.state.event.title} />
            </section>
            <section id="eventIntro">
              <EventIntro intro={this.state.event.intro} />
            </section>
            <section id="eventDescription">
              <EventDescription description={this.state.event.description} />
            </section>
            <section id="eventDetails">
              <EventDetails
                location={this.state.event.location}
                city={this.state.event.city}
                country={this.state.event.country}
                date={this.state.event.date}
                time={this.state.event.time}
                sits={this.state.event.sits}
                price={this.state.event.price}
                currency={this.state.event.currency}
              />
            </section>
            
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
  getEvent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  event: state.event
});

export default connect(
  mapStateToProps,
  {
    getEvent
  }
)(Event);
