import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <span className="align-middle">Events, Organizers, Sponsors</span>
            </div>
            <div className="col-8 text-right">
              <Link to="/events" className="mx-2 align-middle">
                Events
              </Link>
              <Link to="/organizers" className="mx-2 align-middle">
                Organizers
              </Link>
              <Link to="/sponsors" className="mx-2 align-middle">
                Sponsors
              </Link>
              <span className="mx-2 align-middle">
                <a target="__blank" href="https://facebook.com/">
                  <i className="fab fa-facebook fa-2x"></i>
                </a>
              </span>
              <span className="mx-2">
                <a target="__blank" href="https://instagram.com/">
                  <i className="fab fa-instagram fa-2x align-middle"></i>
                </a>
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              <span>
                Copyright © {new Date().getFullYear()} Eventador. All
                rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(withRouter(Footer));
