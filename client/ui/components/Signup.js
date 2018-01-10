import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import Text from '/client/ui/components/Text.js';
import { isEmailValid } from '/imports/api/EmailValidation.js';

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
      redirect: '',
    };

    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSignup(event) {
    event.preventDefault();

    if (!isEmailValid(this.state.email)) {
      this.setState({
        errorMessage: "We've encountered an error: Email address incorrectly formatted"
      });
      return;
    }

    let user = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    Accounts.createUser(user, (err) => {
      if (err) {
        this.setState({
          errorMessage: "We've encountered an error: " + err.reason
        });
      } else {
        this.setState({
          errorMessage: ''
        });
        Meteor.call('sendVerificationEmail', (err, res) => {
          if (err) {
            // Inform user of error in some way.
          }
        });
      }
    });

    // Tell user we sent them a verification email.
    this.setState({
      redirect: <Redirect to={"/signup/verification/" + user.email} />
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
          <Route exact path="/signup" render={() => (
            <div>
              <SignupForm
                username={this.state.username}
                email={this.state.email}
                password={this.state.password}
                handleSignup={this.handleSignup}
                handleChange={this.handleChange}
              />
              <Text color="error" type="body2" text={this.state.errorMessage} />

              {/* Redirect for verification email once signup is complete */}
              {this.state.redirect}
            </div>
          )} />

          {/* Verification */}
          <Route path="/signup/verification/:email" component={Verification} />
        </Paper>
      </div>
    );
  }
}

const SignupForm = ({ username, email, password, handleSignup, handleChange }) => (
  <div>
    <Text style={{ textAlign: 'center' }} color="primary" type="display1" text="Sign up" />
    <Text color="secondary" type="body2" text="Please submit your information below to sign up." />
    <form onSubmit={handleSignup}>
      <div>
        <TextField
          style={{ width: '100%' }}
          label="Username"
          value={username}
          onChange={handleChange('username')}
          required
        />
      </div>
      <div>
        <TextField
          style={{ width: '100%' }}
          label="Email"
          value={email}
          onChange={handleChange('email')}
          required
        />
      </div>
      <div>
        <TextField
          style={{ width: '100%' }}
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={handleChange('password')}
          required
        />
      </div>
      <div style={{ paddingTop: '20px' }}>
        <Button raised color="primary" onClick={handleSignup}>
          Login
        </Button>
      </div>
    </form>
  </div>
);

const Verification = ({ match }) => (
  <div>
    <Text type="headline" color="primary" text="We sent a verification email!" />
    <Text type="body2" color="accent"
      text={"Please verify your account through our email sent to " + match.params.email + "."}
    />
  </div>
);
