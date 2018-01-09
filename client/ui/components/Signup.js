import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

/*
import { Accounts } from 'meteor/accounts-password';
*/


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

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div style={signupStyle}>
        <Paper style={{ padding: '50px' }}>
          <Route exact path="/signup" component={UserSignup} />
        </Paper>
        
      </div>
    );
  }
}

/*
 * User signup component
 */
class UserSignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
    };

    this.handleSignup = this.handleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSignup(event) {
    event.preventDefault();

    console.log('HandleUserSignup: \n' +
                'username: ' + this.state.username + '\n' +
                'email: ' + this.state.email + '\n' +
                'password: ' + this.state.password);

    /*
    Accounts.createUser({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    }, (err) => {
      if (err) console.log("ERROR: Failed to create user - " + err.reason)
    });
    */
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return(
      <SignupForm
        title="Sign up"
        desc="Please enter your username, email, and password to sign up."
        username={this.state.username}
        email={this.state.email}
        password={this.state.password}
        handleSignup={this.handleSignup}
        handleChange={this.handleChange}
      />
    );
  }
}

const LoginForm = ({ title, desc, username, password, handleSignup, handleChange }) => (
  <div>
    <Text style={{ textAlign: 'center' }} color="primary" type="display1" text={title} />
    <Text color="secondary" type="body2" text={desc} />
    <form onSubmit={handleSignup}>
      <div>
        <TextField
          label="Username"
          margin="normal"
          value={username}
          onChange={handleChange('username')}
          required
        />
      </div>
      <div>
        <Textfield
          label="email"
          type="email"
          value={email}
          onchange={handlechange('email')}
          required
        />
      </div>
      <div>
        <Textfield
          label="password"
          type="password"
          autocomplete="current-password"
          value={password}
          onchange={handlechange('password')}
          required
        />
      </div>
      <div style={{ paddingTop: '20px' }}>
        <Button raised color="primary" onClick={handleSignup}>
          Login
        </Button>
      </div>
    </form>

    {/* Link to staff or user signup depending on where we are */}
    <div style={{ textAlign: 'right' }}>
      <Route exact path="/signup/" render={() => (
        <Link to="/signup/staff">
          <Text type="body1" color="secondary" text="Staff Signup" />
        </Link>
      )}/>
      <Route path="/signup/staff" render={() => (
        <Link to="/signup">
          <Text type="body1" color="secondary" text="User Signup" />
        </Link>
      )}/>
    </div>
  </div>
);
