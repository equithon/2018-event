import React, { Component } from 'react';

import MediaQuery from 'react-responsive';

import Paper from 'material-ui/Paper';

import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import Text from '/client/ui/components/Text.js';

export default class Schedule extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.scroll(0, 0);    // Scroll up when loading new page
    }

    render() {
        // Redirect to external calendar
        window.location.replace('https://drive.google.com/file/d/1_qgh-L9b0aA288IGQu7_BxUJU_meMBvj/view?usp=sharing');

        return(
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Text align="center" type="title" color="primary" text="Redirecting..." />
            </div>
        );
    }
}

/* REMOVED - USING EXTERNAL LINK INSTEAD
    render() {
        return(
            <div className="basic-page">
                <HomeAppBar />

                <Text style={{ gridArea: 'title-row', paddingTop: '10px' }}
                    align="center" color="primary" type="display2" text="Schedule" />

                <Paper className="form-paper">
                    <Text align="left" color="primary" type="display1" text="FRI 4" />
                    <MobileBar thickness="3" />
                    <CalendarEntry when="4pm - 12 am" event="ACCOMMODATION CHECKIN" location="Ron Eydt Village" special/>
                    <CalendarEntry when="5:30 - 8 pm" event="REGISTRATION" location="STC Foyer" />
                    <CalendarEntry when="6 - 8 pm" event="DINNER" location="STC Basement" />
                    <CalendarEntry when="8 - 9:30 pm" event="OPENING CEREMONIES" location="STC 1012" />
                    <CalendarEntry when="9:30 - 10:30 pm" event="TEAM BUILDING WORKSHOP" location="STC 1012" />
                    <CalendarEntry when="10 pm" event="HACKING BEGINS!" special />

                    <br/>

                    <Text align="left" color="primary" type="display1" text="SAT 5" />
                    <MobileBar thickness="3" />
                    <CalendarEntry when="8 am - 11:30 pm" event="WORKSHOPS, ACTIVITIES, AND TALKS" special />
                    <CalendarEntry when="8 - 9:30 am" event="BREAKFAST" location="STC Basement" />
                    <CalendarEntry when="9 - 10 am" event="PROGRAMMING FUNDAMENTALS WORKSHOP" location="STC 0050" />
                    <CalendarEntry when="9 - 10 am" event="DEVELOPING YOUR IDEA WORKSHOP" location="STC 0060" />
                    <CalendarEntry when="10 - 11:30 am" event="MEDITATION" location="QNC 1507" />
                    <CalendarEntry when="10:30 - 11:30 am" event="INTRO TO WEB DEV WORKSHOP" location="STC 0050" />
                    <CalendarEntry when="11:30 am- 12 pm" event="MENTAL HEALTH TALK BY TINA CHAN" location="STC 0050" />
                    <CalendarEntry when="12 - 2 pm" event="LUNCH" location="STC Basement" />
                    <CalendarEntry when="1 - 2:30 pm" event="BACKEND PROGRAMMING WORKSHOP" location="STC 0050" />
                    <CalendarEntry when="2 - 4 pm" event="ICE CREAM" location="STC Basement"/>
                    <CalendarEntry when="2 - 11:30 pm" event="HACKENGER HUNT" special/>
                    <CalendarEntry when="3 - 4:30 pm" event="DATA ANALYTICS WORKSHOP" location="QNC 1502" />
                    <CalendarEntry when="3 - 4 pm" event="INTRO TO UI/UX DESIGN WORKSHOP" location="QNC 2502" />
                    <CalendarEntry when="4 - 5:30 pm" event="MINUTE TO WIN IT" location="De-stress Area" />
                    <CalendarEntry when="6 - 8 pm" event="DINNER" location="STC Basement" />
                    <CalendarEntry when="7 - 8:30 pm" event="REACT & JAVASCRIPT WEB DEV WORKSHOP" location="QNC 1502" />
                    <CalendarEntry when="7 - 8 pm" event="PITCHING YOUR IDEA WORKSHOP" location="QNC 2502" />
                    <CalendarEntry when="7 - 8:30 pm" event="THERAPY DOGS" location="QNC 1507" />

                    <br/>

                    <Text align="left" color="primary" type="display1" text="SUN 6" />
                    <MobileBar thickness="3" />
                    <CalendarEntry when="8 - 9:30 am" event="BREAKFAST" location="STC Basement" />
                    <CalendarEntry when="10 am - 4 pm" event="NETWORKING FAIR" location="STC Foyer" special />
                    <CalendarEntry when="11 am" event="HACKING ENDS & SUBMISSIONS DUE" special />
                    <CalendarEntry when="11 am" event="ACCOMMODATION CHECKOUT ENDS" location="Ron Eydt Village" special />
                    <CalendarEntry when="12 - 2 pm" event="LUNCH" location="STC Basement" />
                    <CalendarEntry when="12 - 3 pm" event="JUDGING" location="STC 0010-0060" />
                    <CalendarEntry when="4 - 6 pm" event="CLOSING CEREMONIES & WINNERS ANNOUNCED" location="STC 1012" />
                </Paper>
            </div>
        );
    }
const CalendarEntry = ({ when, event, location, special }) => (
    <div>
        <div className="tri-split-column-row" style={{ padding: '10px' }}>
            <div style={{ gridArea: 'left' }}>
                <Text align="center" color="inherit" type="body2" text={<strong> {when} </strong>} />
            </div>

            <div style={{ gridArea: 'center' }}>
                { (special) ?
                    <Text align="center" color="primary" type="body2" text={event} /> :
                    <Text align="center" color="inherit" type="body2" text={event} />
                }
            </div>

            <div style={{ gridArea: 'right' }}>
                <Text align="center" color="inherit" type="body2" text={location} />
            </div>
        </div>

        <MobileBar thickness="1" />
    </div>
);

const MobileBar = ({ thickness }) => (
    <MediaQuery maxDeviceWidth={600}>
        { (matches) => {
            return (matches) ? <div style={{ height: thickness + 'px', backgroundColor: '#d5dffa' }}></div> : false;
        }}
    </MediaQuery>
);
*/
