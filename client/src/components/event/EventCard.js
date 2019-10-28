import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

class EventCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="row mt-5">
        <div className="col-12 mb-2">
          <div className="row border">
            <div className="col-2 px-0">
              <a href="./event.html">
                <img
                  src={
                    this.props.event.avatar
                      ? this.props.event.avatar.location
                      : 'https://picsum.photos/200/160?random=1'
                  }
                  alt="img1"
                  className="img-fluid"
                />
              </a>
              <div className="bg-dark">
                <p className="mb-0 text-center text-light">
                  <i>{this.props.event.category}</i>
                </p>
              </div>
            </div>
            <div className="col-6 border-left">
              <h3 className="mt-2">{this.props.event.title}</h3>
              <p className="lead mb-0">{this.props.event.intro}</p>
            </div>
            <div className="col-3 border-left border-right text-left">
              <p className="lead mb-1">
                <i className="icon fas fa-map-marker-alt text-center eventCardIcon"></i>
                {this.props.event.city} , {this.props.event.country}
              </p>
              <p className="lead mb-1">
                <i className="icon fas fa-calendar-alt text-center eventCardIcon"></i>
                <Moment format="D MMM YYYY" withTitle>
                  {this.props.event.date}
                </Moment>
              </p>
              <p className="lead mb-1">
                <i className="icon fas fa-clock text-center eventCardIcon"></i>
                {this.props.event.time}
              </p>
              <p className="lead mb-1">
                <i className="icon fas fa-dollar-sign text-center eventCardIcon"></i>
                {this.props.event.price}
              </p>
              <p className="lead mb-1">
                <i className="icon fas fa-chair text-center eventCardIcon"></i>
                {this.props.event.sits}
              </p>
            </div>
            <div className="col-1 mt-2">
              <button className="btn btn-block btn-success btn-sm">
                <i className="fas fa-dollar-sign"></i>
              </button>
              <button className="btn btn-block btn-success btn-sm">
                <i className="fas fa-building"></i>
              </button>
              <button className="btn btn-block btn-success btn-sm">
                <i className="fas fa-pizza-slice"></i>
              </button>
              <button className="btn btn-block btn-success btn-sm">
                <i className="fas fa-coffee"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EventCard.propTypes = {
  event: PropTypes.object.isRequired
};

export default EventCard;
