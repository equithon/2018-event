import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import indigo from 'material-ui/colors/indigo';
import Typography from 'material-ui/Typography';

import HomeAppBar from '/imports/ui/HomeAppBar.js';
import SubText from '/imports/ui/home-components/SubText.js';

import { StayPosted, Facebook, Twitter, Instagram} from '/imports/ui/buttons/SocialMedia.js';

const theme = createMuiTheme({
  palette: {
    primary: indigo,  // Placeholders until we get actual
    secondary: purple // color palettes.
  }
});

const imageStyle = {
  // Z - Image is centered in its grid cell but it won't scale
  // screen size.
  maxHeight: '300px',
  maxWidth: '500px',
  height: '100%',
  width: 'auto',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const mainTextBoxStyle = {
  gridArea: 'rr1',

  display: 'grid',
  gridTemplateRows: '4fr 1fr',
  gridRowGap: '5px',
  padding: '5px'
};

const StayPostedStyle = {
  float: 'left',
  padding: '10px',
}
const FacebookButtonStyle = {
  float: 'left',
  padding: '10px',
}
const TwitterButtonStyle = {
  float: 'left',
  padding: '10px',
}
const InstagramButtonStyle = {
  float: 'left',
  padding: '10px',
}
// Main application entry point
export default class App extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div id="app">
          <HomeAppBar />

          <div id="app-body">
            {/* SubText */}
            <div style={{gridArea: 'st'}}></div>
            <SubText />

            {/* Row 1 */}
            <div style={{gridArea: 'lr1', width: '100%', height: '100%'}}>
              <img style={imageStyle} src="/images/placeholder.jpg" />
            </div>
            <div style={mainTextBoxStyle}>
              <Typography color="primary" type="display2" align="left">
                Waterloo's biggest social innovation hackathon is coming back in May 2018.
              </Typography>

              <div>
                <div style={StayPostedStyle}>{ StayPosted() }</div>
                <div style={FacebookButtonStyle}>{ Facebook() }</div>
                <div style={TwitterButtonStyle}>{ Twitter() }</div>
                <div style={InstagramButtonStyle}>{ Instagram() }</div>
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
