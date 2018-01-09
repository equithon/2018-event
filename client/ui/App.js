import React, {Component} from 'react';
import MediaQuery from 'react-responsive';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import indigo from 'material-ui/colors/indigo';
import {List, ListItem} from "material-ui";
import Button from 'material-ui/Button';

import HomeAppBar from '/client/ui/HomeAppBar.js';
import SubText from '/client/ui/components/home-components/SubText.js';
import Text from '/client/ui/components/Text.js';
import {StayPosted, Facebook, Twitter, Instagram} from '/client/ui/buttons/SocialMedia.js';
import SubscriptionModal from '/client/ui/components/SubscriptionModal.js';

const theme = createMuiTheme({
    palette: {
        primary: indigo,  // Placeholders until we get actual
        secondary: purple // color palettes.
    }
});

const mainTextBoxStyle = {
    gridArea: 'right',

    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridRowGap: '5px',
    padding: '5px'
};

// Main application entry point
export default class App extends Component {
    constructor(props) {
      super(props);

      this.state = {
        subModalOpen: false
      };
    };

    handleOpen = () => {
      this.setState({
        subModalOpen: true
      });
    }

    handleClose = () => {
      this.setState({
        subModalOpen: false
      });
    }

    renderAppBody() {
      return(
        <div id="app-body">
          <HomeSubText />

            {/* Row 1 */}
            <div className="split-column-row" style={{gridArea: 'title-row', gridColumnGap: '20px', alignItems: 'center'}}>
              <div style={{gridArea: 'left'}}>
                <img style={{ width: '100%', height: 'auto' }}
                  src="/images/placeholder.jpg"/>
              </div>

              <div style={mainTextBoxStyle}>
                <Text color="primary" type="display2" align="left"
                  text="Waterloo's biggest social innovation hackathon is coming back in May 2018."
                />

                <SocialMedia open={this.state.subModalOpen} onClick={this.handleOpen} onClose={this.handleClose} />
              </div>
            </div>

            {/* Row 2*/}
            <div className="split-column-row" style={{gridArea: 'info-row', gridColumnGap: '20px', alignItems: 'center'}}>
                <div style={{gridArea: 'left'}}>
                    <Text color="primary" type="display2" text="What is Equithon?" />
                    <Text color="secondary" type="body1" align="left"
                      text="Equithon is a hackathon for students to create technical projects that solve an equity issue or promote equity. We strive to provide an inclusive environment at our event where hackers can get support from industry mentors to develop their ideas and projects."
                    />
                </div>
                <div style={{gridArea: 'right'}}>
                    <img style={{width: '100%', height: 'auto'}} src="/images/placeholder.jpg"/>
                </div>
            </div>

            {/* Row 3 */}
            <div style={{gridArea: 'quote-row', justifySelf: 'center'}}>
                <Text color="primary" type="display1" align="left"
                  text="&quotEquity isn't a women's issue,<br/>    Equity is an everyone issue.&quot" />
                <br/>
                <Text color="primary" type="headline" align="right" text="Feridun Hamdullahpur,<br/> President and Vice-Chancellor" />
            </div>

            {/* Row 4*/}
            <div style={{gridArea: 'faq-row', justifySelf: 'center'}}>
                <Text color="primary" type="display2" align="left" text="Frequently Asked Questions" />
                {/*
                <List>
                    <ListItem primaryText="1. What is a Hackathon?" open={true} nestedItems={[
                        <ListItem secondaryText="A hackathon is..."/>
                    ]}/>
                </List>
                */}
            </div>
        </div>
      );
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
              <Router>
                <div id="app">
                    <HomeAppBar/>

                    <Route exact path="/" render={() => this.renderAppBody()} />
                    <Route path="/login" component={UserLogin} />
                </div>
              </Router>
            </MuiThemeProvider>
        );
    }
}

/*
 * Main Home Components
 */
// Subtext
const HomeSubText = () => (
  <MediaQuery maxWidth='600px'>
    { (matches) => {
      if (matches) return(
        <div style={{ gridArea: 'subtext-row'}}>
          <SubText />
        </div>
      );
      else return(
        <div style={{ gridArea: 'subtext-row', justifySelf: 'end'}}>
          <SubText />
        </div>
      );
    }}
  </MediaQuery>
);

// Social Media Component
const SocialMedia = ({ open, onClick, onClose }) => (
  <div className='social-media-buttons'>
    <div style={{gridArea: 'email', padding: '10px', width: 'auto', textAlign: 'center'}}>
      <Button raised color="primary" onClick={onClick}>
        Stay Posted
      </Button>
      <SubscriptionModal open={open} onClose={onClose} />
    </div>
    <SocialButtons />
  </div>
);

// Extra Social Media Buttons
const SocialButtons = () => (
  <div style={{gridArea: 'social', display: 'inline', width: 'auto', textAlign: 'center'}}>
    {Facebook()}
    {Twitter()}
    {Instagram()}
  </div>
);
