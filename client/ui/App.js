import React, {Component} from 'react';
import MediaQuery from 'react-responsive';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import indigo from 'material-ui/colors/indigo';
import {List, ListItem} from "material-ui";
import Button from 'material-ui/Button';

import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import SubText from '/client/ui/components/SubText.js';
import Text from '/client/ui/components/Text.js';
import {StayPosted, Facebook, Twitter, Instagram} from '/client/ui/buttons/SocialMedia.js';
import SubscriptionModal from '/client/ui/components/SubscriptionModal.js';
import FaqCard from '/client/ui/components/FaqCard.js';

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

<<<<<<< HEAD
                    <Route exact path="/" render={() => this.renderAppBody()} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
=======
                    <div id="app-body">
                        {/* SubText */}
                        <MediaQuery maxWidth='600px'>
                          { (matches) => {
                            if (matches) return(
                              <div style={{ gridArea: 'subtext-row'}}>
                                <SubText />
                              </div>);
                            else return <div style={{ gridArea: 'subtext-row', justifySelf: 'end'}}><SubText /></div>;
                          }}
                        </MediaQuery>

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

                          {/* <div className='split-column-row'> */}

                            <div className='social-media-buttons'>
                              <div style={{gridArea: 'email', padding: '10px', width: 'auto', textAlign: 'center'}}>
                                <Button raised color="primary" onClick={this.handleOpen}>
                                  Stay Posted
                                </Button>
                                <SubscriptionModal open={this.state.subModalOpen} onClose={this.handleClose} />
                              </div>
                              <div style={{gridArea: 'social', display: 'inline', width: 'auto', textAlign: 'center'}}>
                                {Facebook()}
                                {Twitter()}
                                {Instagram()}
                              </div>
                            </div>
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
                            <Text color="primary" type="display2" align="center" text="Frequently Asked Questions" />
                            <br/>
                            <FAQ />
                        </div>
                    </div>
>>>>>>> Added FaqCards
                </div>
              </Router>
            </MuiThemeProvider>
        );
    }
}

/*
<<<<<<< HEAD
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
=======
 * FAQs to be displayed as a series of collapsable cards.
 */
const FAQ = () => (
  <div>
    <FaqCard
      question="What is a hackathon?"
      answer="A hackathon is an event where the participants, either individually or in teams, build projects from scratch over a short period of time (in this case, three days) and present to a team of judges. Hackathons are a place to be creative, learn new skills, and make new friends!"
      number="1."
    />
    <br/>
    <FaqCard
      question="Can I attend if I have never coded and/or been to a hackathon before?"
      answer="Definitely! Equithon is open to all students who are interested in supporting equity. Experience in coding is an asset, but is not required. There will be many workshops tailored to a range of skill levels to help you with your hack."
      number="2."
    />
    <br/>
    <FaqCard
      question="What can I make?"
      answer="You can make anything that raises awareness of or addresses an issue related to equity - whether it be gender, racial, etc. We will be providing resources leading up to and during Equithon to help you brainstorm."
      number="3."
    />
    <br/>
    <FaqCard
      question="Can I work on a project at Equithon that I’ve already started?"
      answer="No. To ensure fairness, hackers must submit projects started at Equithon."
      number="4."
    />
    <br/>
    <FaqCard
      question="Why is Equithon not an overnight event?"
      answer="We decided that Equithon should not be an overnight event because we want to be as inclusive as possible. Hackathons that span a whole weekend can be intimidating - we want people who would not normally be comfortable attending hackathons to join us too."
      number="5."
    />
    <br/>
    <FaqCard
      question="When are applications open?"
      answer="Applications for hackers will open in Winter 2018."
      number="6."
    />
    <br/>
    <FaqCard
      question="Have more questions?"
      number="7."
      answer='Send us an email at <a href="mailto:hello@equithon.org">hello@equithon.org</a>.' // Iffy syntax but necessary to make link
    />
>>>>>>> Added FaqCards
  </div>
);
