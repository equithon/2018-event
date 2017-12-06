import React, { Component } from 'react';

import HomeAppBar from '/imports/ui/HomeAppBar.js';
import SubText from '/imports/ui/HomeComponents/SubText.js';

// Main application entry point
export default class App extends Component {
  constructor(props) {
    super(props);
  };

  // Navbar at the top

  render() {
    return (
      <div id="app">
        <HomeAppBar />

        <div id="app-body">
          {/* Row 1 */}
          <div className="app-body-cell"></div>
          <SubText />

        </div>
      </div>
    );
  }
}
