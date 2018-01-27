import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';

import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/buttons/FlatColoredButton.js';


const loginStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginRight: '-50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '500px',
  padding: '10px',
  paddingTop: '110px',
};


export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',

      success: false,
      errorMessage: '',
    };

    this.handleUserLogin = this.handleUserLogin.bind(this);
    this.handleStaffLogin = this.handleStaffLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleUserLogin(event) {
    event.preventDefault();

    Meteor.loginWithPassword({ username: this.state.username }, this.state.password, (err) => {
      if (err) this.setState({
        errorMessage: err.reason,
      });
      else this.setState({
        success: true,
        errorMessage: '',
      });
    });
  }

  handleStaffLogin(event) {
    event.preventDefault();
    console.log('HANDLESTAFFLOGIN: ' + this.state.username + ' ' + this.state.password);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return(
      <div style={loginStyle}>
        <Paper id="login" style={{ padding: '50px' }}>

					{/* User Login */}
          <Route exact path="/login" render={() => (
						<UserLogin
							username={this.state.username}
							password={this.state.password}
							handleLogin={this.handleUserLogin}
							handleChange={this.handleChange}
						/>
					)} />

					{/* Staff Login */}
          <Route path="/login/staff" render={() => (
						<StaffLogin
							username={this.state.username}
							password={this.state.password}
							handleLogin={this.handleUserLogin}
							handleChange={this.handleChange}
						/>
					)} />

          {/* Redirect user if login was successful */}
          { (this.state.success) ? <Redirect to="/" /> :
              <Text type="body1" color="error" text={this.state.errorMessage} />
          }
        </Paper>
      </div>
    );
  }
}


const UserLogin = ({ username, password, handleLogin, handleChange }) => (
  <LoginForm
    title="User Login"
    desc="Please enter your username and password."
    username={username}
    password={password}
    handleLogin={handleLogin}
    handleChange={handleChange}
  />
);

const StaffLogin = ({ username, password, handleLogin, handleChange }) => (
	<LoginForm
		title="Staff Login"
		desc="Please enter your staff username and password."
		username={username}
		password={password}
		handleLogin={handleLogin}
		handleChange={handleChange}
	/>
);

const LoginForm = ({ title, desc, username, password, handleLogin, handleChange }) => (
  <div>
    <Text style={{ textAlign: 'center' }} color="primary" type="display1" text={title} />
    <Text color="secondary" type="body2" text={desc} />
    <form onSubmit={handleLogin}>
      {/* Username */}
      <div>
        <TextField
          label="Username"
          value={username}
          onChange={handleChange('username')}
          required
        />
      </div>

      {/* Password */}
      <div>
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={handleChange('password')}
          required
        />
      </div>

      {/* Login Button */}
      <div style={{ paddingTop: '20px' }}>
        <FlatColoredButton onClick={handleLogin} content="Login" />
      </div>

      {/* Link to staff or user login depending on where we are */}
      <Route exact path="/login/" render={() => (
        <Text type="body1" color="secondary" align="right"
          text={ <Link to="/login/staff" replace>Staff Login</Link> }
        />
      )}/>
      <Route path="/login/staff" render={() => (
        <Text type="body1" color="secondary" align="right"
          text={ <Link to="/login" replace>User Login</Link> }
        />
      )}/>
    </form>
  </div>
);
