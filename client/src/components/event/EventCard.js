import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EventCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div class="row mt-5">
        <div class="col-12 mb-2">
          <div class="row border">
            <div class="col-2 px-0">
              <a href="./event.html">
                <img
                  src={
                    this.props.event.avatar
                      ? this.props.event.avatar.location
                      : 'https://picsum.photos/200/160?random=1'
                  }
                  alt="img1"
                  class="img-fluid"
                />
              </a>
              <div class="bg-dark">
                <p class="mb-0 text-center text-light">
                  <i>{this.props.event.category}</i>
                </p>
              </div>
            </div>
            <div class="col-7 border-left">
              <h3 class="mt-2">{this.props.event.title}</h3>
              <p class="lead mb-0">{this.props.event.intro}</p>
            </div>
            <div class="col-2 border-left border-right">
              <p class="lead mb-1">
                <i class="icon fas fa-map-marker-alt"></i>
                {this.props.event.city} , {this.props.event.country}
              </p>
              <p class="lead mb-1">
                <i class="icon fas fa-calendar-alt"></i>
                {this.props.event.date}
              </p>
              <p class="lead mb-1">
                <i class="icon fas fa-clock"></i>
                {this.props.event.time}
              </p>
              <p class="lead mb-1">
                <i class="icon fas fa-dollar-sign"></i>
                {this.props.event.price}
              </p>
              <p class="lead mb-1">
                <i class="icon fas fa-chair"></i>
                {this.props.event.sits}
              </p>
            </div>
            <div class="col-1 mt-2">
              <button class="btn btn-block btn-success btn-sm">
                <i class="fas fa-dollar-sign"></i>
              </button>
              <button class="btn btn-block btn-success btn-sm">
                <i class="fas fa-building"></i>
              </button>
              <button class="btn btn-block btn-success btn-sm">
                <i class="fas fa-pizza-slice"></i>
              </button>
              <button class="btn btn-block btn-success btn-sm">
                <i class="fas fa-coffee"></i>
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
