import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextInput from '../common/TextInput';
import Helmet from 'react-helmet';
import Switch from 'react-switch';
import classnames from 'classnames';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {},
      type: 'organizer'
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  };

  handleChange = checked => {
    let type = 'organizer';
    if (checked) {
      type = 'sponsor';
    }
    this.setState({ type });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      type: this.state.type
    };
    console.log(this.state.type);
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <section id="register">
        <Helmet>
          <style>
            {'footer { position: absolute; width: 100%; bottom: 0; }'}
          </style>
        </Helmet>
        <div className="container pt-5">
          <div className="row mt-5 pt-5">
            <div className="col-md-6 mx-auto">
              <div className="card">
                <div className="card-header p-0">
                  <div className="row text-center text-white mx-0">
                    <div className="col-6 bg-light p-0">
                      <Link to="/login" style={{ textDecoration: 'none' }}>
                        <p id="signInLink" className="py-1 lead m-0 text-muted">
                          <i>Sign In</i>
                        </p>
                      </Link>
                    </div>
                    <div className="col-6 bg-secondary p-0">
                      <p className="py-1 lead m-0">
                        <b>Sign Up</b>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="my-1 row align-items-center pb-3">
                    <span
                      className={classnames(
                        'mx-4 col h4 my-0 py-1 accountTypePassive',
                        {
                          accountTypeActive: this.state.type === 'organizer'
                        }
                      )}
                    >
                      ORGANIZER
                    </span>
                    <Switch
                      onColor={'#DDD'}
                      offColor={'#DDD'}
                      offHandleColor={'#080'}
                      onHandleColor={'#080'}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      width={100}
                      height={20}
                      handleDiameter={25}
                      onChange={this.handleChange}
                      checked={this.state.type === 'sponsor' ? true : false}
                    />
                    <span
                      className={classnames(
                        'mx-4 col h4 my-0 py-1 accountTypePassive',
                        {
                          accountTypeActive: this.state.type === 'sponsor'
                        }
                      )}
                    >
                      SPONSOR
                    </span>
                  </div>
                  <form noValidate onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <TextInput
                        name="name"
                        placeholder="full name"
                        value={this.state.name}
                        onChange={this.onChange}
                        error={errors.name}
                      />
                    </div>
                    <div className="form-group">
                      <TextInput
                        name="email"
                        type="email"
                        placeholder="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        error={errors.email}
                      />
                    </div>
                    <div className="form-group">
                      <TextInput
                        name="password"
                        type="password"
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.onChange}
                        error={errors.password}
                      />
                    </div>
                    <div className="form-group">
                      <TextInput
                        name="password2"
                        type="password"
                        placeholder="confirm password"
                        value={this.state.password2}
                        onChange={this.onChange}
                        error={errors.password2}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-secondary btn-block btn-rounded"
                    >
                      Sign Up
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
