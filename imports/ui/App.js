import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import indigo from 'material-ui/colors/indigo';
import Typography from 'material-ui/Typography';

import HomeAppBar from '/imports/ui/HomeAppBar.js';
import SubText from '/imports/ui/home-components/SubText.js';
import Image from '/imports/ui/home-components/Image.js';

import StayPosted from '/imports/ui/buttons/StayPosted.js';


const theme = createMuiTheme({
  palette: {
    primary: indigo,  // Placeholders until we get actual
    secondary: purple // color palettes.
  }
});

const imageStyle = {
  // Z - This is an attempt to force the image to responsively
  // scale with screensize but it just doesn't work.
  // I can't seem to figure out why.
  maxHeight: '300px',
  maxWidth: '500px',
  height: '100%',
  width: 'auto'
};
const mainTextStyle = {
  display: 'grid',
  gridTemplateRows: '4fr 1fr',
  gridRowGap: '5px',
  padding: '5px'
};

// Main application entry point
export default class App extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const socialMediaButtons =
      <div style={{display: 'inline'}}>
        <StayPosted />
        {/*<FacebookButton />
        <TwitterButton />
        <InstagramButton />*/}
      </div>;

    return (
      <MuiThemeProvider theme={theme}>
        <div id="app">
          <HomeAppBar />

          <div id="app-body">
            {/* SubText */}
            <div style={{gridArea: 'st'}}></div>
            <SubText />

            {/* Row 1 */}
            <Image gridArea="lr1" style={imageStyle} src="/images/placeholder.jpg" />
            <div style={mainTextStyle}>
              <Typography type="display2" align="left">
                Waterloo's biggest social innovation hackathon is coming back in May 2018.
              </Typography>
              {socialMediaButtons}
            </div>

          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
