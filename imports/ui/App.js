import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';


// Main application entry point
export default class App extends Component { constructor(props) { super(props); };

  // Navbar at the top
  renderAppBar() {
    return (
      <AppBar id="AppBar" position="fixed" color="white">
        <Toolbar>
          <img className="equithon-logo" src="/images/equithon_logo.png" />
        </Toolbar>
      </AppBar>
    );
  }

  render() {
    return (
      <div id="App">
        <div>
          { this.renderAppBar() }
        </div>
      </div>
    );
  }
}
