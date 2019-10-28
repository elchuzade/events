import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventCard from './EventCard';

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
          <div className="container pt-5">
            <img src="https://picsum.photos/1000" alt="img"/>
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
