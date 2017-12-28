import React, {Component} from 'react';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import indigo from 'material-ui/colors/indigo';
import Typography from 'material-ui/Typography';

import HomeAppBar from '/client/ui/HomeAppBar.js';
import SubText from '/client/ui/components/home-components/SubText.js';

import {StayPosted, Facebook, Twitter, Instagram} from '/client/ui/buttons/SocialMedia.js';
import {List, ListItem} from "material-ui";

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

const StayPostedStyle = {
    float: 'left',
    padding: '10px',
};
const FacebookButtonStyle = {
    float: 'left',
    padding: '10px',
};
const TwitterButtonStyle = {
    float: 'left',
    padding: '10px',
};
const InstagramButtonStyle = {
    float: 'left',
    padding: '10px',
};

// Main application entry point
export default class App extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <div id="app">
                    <HomeAppBar/>

                    <div id="app-body">
                        {/* SubText */}
                        <div style={{gridArea: 'subtext-row', justifySelf: 'end'}}>
                            <SubText/>
                        </div>

                        {/* Row 1 */}
                        <div className="split-column-row" style={{gridArea: 'title-row', gridColumnGap: '20px', alignItems: 'center'}}>
                            <div style={{gridArea: 'left'}}>
                                <img style={{ width: '100%', height: 'auto' }}
                                src="/images/placeholder.jpg"/>
                            </div>
                            <div style={mainTextBoxStyle}>
                                <Typography color="primary" type="display2" align="left">
                                    Waterloo's biggest social innovation hackathon is coming back in May 2018.
                                </Typography>
                                <div>
                                    <div style={StayPostedStyle}>{StayPosted()}</div>
                                    <div style={FacebookButtonStyle}>{Facebook()}</div>
                                    <div style={TwitterButtonStyle}>{Twitter()}</div>
                                    <div style={InstagramButtonStyle}>{Instagram()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2*/}
                        <div className="split-column-row" style={{gridArea: 'info-row', gridColumnGap: '20px', alignItems: 'center'}}>
                            <div style={{gridArea: 'left'}}>
                                <Typography color="primary" type="display1">
                                    What is Equithon?
                                </Typography>
                                <Typography color="secondary" type="Body1" align="left">
                                    Equithon is a hackathon for students to create technical projects that solve an equity issue or promote equity. We strive to provide an inclusive environment at our event where hackers can get support from industry mentors to develop their ideas and projects.
                                </Typography>
                            </div>
                            <div style={{gridArea: 'right'}}>
                                <img style={{width: '100%', height: 'auto'}} src="/images/placeholder.jpg"/>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div style={{gridArea: 'quote-row', justifySelf: 'center'}}>
                            <Typography color="primary" type="display2" align="left" style={{whiteSpace: 'pre'}}>"Equity isn't a women's issue,<br/>   Equity is an everyone issue."</Typography>
                            <Typography color="primary" type="headline" align="left">Feridun Hamdullahpur, President and Vice-Chancellor</Typography>
                        </div>

                        {/* Row 4*/}
                        <div style={{gridArea: 'faq-row', justifySelf: 'center'}}>
                            <Typography color="primary" type="display2" align="left">Frequently Asked Questions</Typography>
                            <List>
                                <ListItem primaryText="1. What is a Hackathon?" open={true} nestedItems={[
                                    <ListItem secondaryText="A hackathon is..."/>
                                ]}/>
                            </List>
                        </div>

                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}
