import React, {Component} from 'react';
import MediaQuery from 'react-responsive';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import indigo from 'material-ui/colors/indigo';
import {Card, CardMedia, List, ListItem, Paper} from "material-ui";
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

const imageElevation = 7;

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
    };

    handleClose = () => {
        this.setState({
            subModalOpen: false
        });
    };

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
        let mobile = false;
        return (
            <MuiThemeProvider theme={theme}>
              <Router>
                <div id="app">
                    <HomeAppBar/>

                    <div id="app-body">
                        {/* SubText */}
                        <MediaQuery maxDeviceWidth={600}>
                            { (matches) => {
                                mobile = matches;
                                if (matches) return (
                                    <div style={{ gridArea: 'subtext-row', zIndex: 50 }}>
                                        <Card elevation={ 7 } raised={ true } style={{ width: '100%', marginBottom: '-30px' }}>
                                            <div className="subtext-grid" style={{ width: '100%'}}>
                                                <div style={{ gridArea: 'left', margin: '5px', marginLeft: '10px' }}>
                                                    <Text type="body1" text="WHEN"/>
                                                    <Text type="body1" text="May 2018"/>
                                                </div>
                                                <div style={{ gridArea: 'right', margin: '5px', marginRight: '10px', marginLeft: '-10px'}}>
                                                    <Text type="body1" align="right" text="WHERE"/>
                                                    <Text type="body1" align="right" text="University of Waterloo"/>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>);
                                else return (
                                    <div style={{ gridArea: 'subtext-row', justifySelf: 'end'}}>
                                        <SubText />
                                    </div>
                                );
                            }}
                        </MediaQuery>

                        {/* Row 1 */}
                        <div id="title-row" className="split-column-row" style={{ gridArea: 'title-row', gridColumnGap: '20px', alignItems: 'center' }}>
                            <div style={{gridArea: 'left'}}>
                                <MediaQuery maxDeviceWidth={600}>
                                    { (matches) => {
                                        if (matches) {
                                            return (
                                                <Card elevation={ imageElevation } className="image-card" style={{ marginTop: '-20px'}}>
                                                    <CardMedia id={"title-row-image"}
                                                               image="/images/placeholder.jpg"/>
                                                </Card>
                                            );

                                        } else {
                                            return (
                                                <Card className="image-card" elevation={ imageElevation }>
                                                    <CardMedia id={"title-row-image"}
                                                               image="/images/placeholder.jpg"/>
                                                </Card>
                                            )
                                        }
                                    }}

                                </MediaQuery>
                            </div>

                            <div style={mainTextBoxStyle}>
                                <MediaQuery maxDeviceWidth={600}>
                                    { (matches) => {
                                        if (matches) {
                                            return (
                                                <Card style={{ padding: '20px 15px 20px 15px', marginTop: '-20px'}}>
                                                    <Text color="primary" type="display2" align="center"
                                                          text="Waterloo's biggest social innovation hackathon is coming back in May 2018."
                                                    />
                                                </Card>
                                            )
                                        } else {
                                            return (
                                                <Text color="primary" type="display2" align="left"
                                                      text="Waterloo's biggest social innovation hackathon is coming back in May 2018."
                                                />
                                            )
                                        }
                                    }}
                                </MediaQuery>
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
                            <div className="centered-mobile" style={{gridArea: 'left'}}>

                                <MediaQuery maxDeviceWidth={600}>
                                    { (matches) => {
                                        if (matches) {
                                            return (
                                                <div>
                                                    <Text color="primary" type="display2" align="center" text="What is Equithon?" />
                                                    <Text color="secondary" type="body1" align="center"
                                                          text="Equithon is a hackathon for students to create technical projects that solve an equity issue or promote equity. We strive to provide an inclusive environment at our event where hackers can get support from industry mentors to develop their ideas and projects."
                                                    />
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div>
                                                    <Text color="primary" type="display2" text="What is Equithon?" />
                                                    <Text color="secondary" type="body1" align="left"
                                                          text="Equithon is a hackathon for students to create technical projects that solve an equity issue or promote equity. We strive to provide an inclusive environment at our event where hackers can get support from industry mentors to develop their ideas and projects."
                                                    />
                                                </div>
                                            )
                                        }
                                    }}
                                </MediaQuery>

                            </div>
                            <div style={{gridArea: 'right'}}>
                                <Card className="image-card" elevation={ imageElevation } style={{ marginLeft: '-10px', marginRight: '-10px'}}>
                                    <CardMedia id={"info-row-image"}
                                               image="/images/placeholder.jpg"/>
                                </Card>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div style={{gridArea: 'quote-row', justifySelf: 'center'}}>
                            <MediaQuery maxDeviceWidth={600}>
                                { (matches) => {
                                    if (matches) {
                                        return (
                                            <Text color="primary" type="headline" align="left"
                                                  text="&quotEquity isn't a women's issue,<br/>    Equity is an everyone issue.&quot" />
                                        )
                                    } else {
                                        return (
                                            <Text color="primary" type="display1" align="left"
                                                  text="&quotEquity isn't a women's issue,<br/>    Equity is an everyone issue.&quot" />
                                        )
                                    }
                                }}
                            </MediaQuery>
                            <br/>
                            <Text color="primary" type="subheading" align="right" text="Feridun Hamdullahpur,<br/> President and Vice-Chancellor" />
                        </div>

                        {/* Row 4*/}
                        <div style={{gridArea: 'faq-row', justifySelf: 'center'}}>
                            <Text color="primary" type="display2" align="center" text="Frequently Asked Questions" />
                            <br/>
                            <FAQ />
                        </div>
                    </div>
                </div>
              </Router>
            </MuiThemeProvider>
        );
    }
}

/*
 * FAQs to be displayed as a series of collapsable cards.
 */
const FAQ = () => (
<<<<<<< HEAD
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
  </div>
=======
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
    </div>
>>>>>>> Put everything into cards to approximate the design
);
