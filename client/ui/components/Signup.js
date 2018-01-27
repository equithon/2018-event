import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/buttons/FlatColoredButton.js';

const signupStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '500px',
  padding: '10px',
  paddingTop: '110px',
};

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',

      errorMessage: '',
      successMessage: '',
    };

    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSignup(event) {
    event.preventDefault();

    let user = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    Accounts.createUser(user, (err) => {
      if (err) {
        this.setState({
          errorMessage: err.reason,
          successMessage: '',
        });
      } else {
        this.setState({
          errorMessage: '',
          successMessage: 'Success! Please verify your email address via the link sent to ' + user.email + '.',
        });

        // Send verification email.
          Meteor.call('sendVerificationEmail', { email: user.email }, (err, res) => {
              if (err) {
                  this.setState({
                      errorMessage: err.reason
                  });
              }
          });
      }
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return(
      <div style={signupStyle}>
        <Paper style={{ padding: '50px' }}>
          <div style={{ paddingBottom: '10px' }}>
            <Text style={{ textAlign: 'center' }} color="primary" type="display1" text="Sign up" />
            <Text color="secondary" type="body2" text="Please submit your information below to sign up." />
            <form onSubmit={this.handleSignup}>
              {/* Username */}
              <div>
                <TextField
                  style={{ width: '100%' }}
                  label="Username"
                  value={this.state.username}
                  onChange={this.handleChange('username')}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <TextField
                  style={{ width: '100%' }}
                  label="Email"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <TextField
                  style={{ width: '100%' }}
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={this.handleChange('password')}
                  required
                />
              </div>

              {/* Signup Button */}
              <div style={{ paddingTop: '20px' }}>
                  <FlatColoredButton onClick={this.handleSignup} content="Sign Up" />
              </div>
            </form>
          </div>

          { (this.state.successMessage) ? <Text color="primary" type="body2" text={this.state.successMessage} /> :
                                          <Text color="error" type="body2" text={this.state.errorMessage} /> }
        </Paper>
      </div>
    );
  }
}
