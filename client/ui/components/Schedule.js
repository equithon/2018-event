import React, { Component } from 'react';

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
        return(
            <div className="basic-page">
                <HomeAppBar />

                <Text style={{ gridArea: 'title-row', paddingTop: '10px' }}
                    align="center" color="primary" type="display2" text="Schedule" />

                <Paper className="form-paper">
                    <Text align="left" color="primary" type="display1" text="FRI 4" />
                    <CalendarEntry when="4pm - 12 am" event="ACCOMMODATION CHECKIN" special/>
                    <CalendarEntry when="5:30 - 8 pm" event="REGISTRATION" />
                    <CalendarEntry when="6 - 8 pm" event="DINNER" />
                    <CalendarEntry when="8 - 9:30 pm" event="OPENING CEREMONIES" />
                    <CalendarEntry when="9:30 - 10:30 pm" event="TEAM BUILDING WORKSHOP" />
                    <CalendarEntry when="10 pm" event="HACKING BEGINS!" special />

                    <br/>

                    <Text align="left" color="primary" type="display1" text="SAT 5" />
                    <CalendarEntry when="8 am - 11:30 pm" event="WORKSHOPS, ACTIVITIES, AND TALKS" special />
                    <CalendarEntry when="8 - 9:30 am" event="BREAKFAST" />
                    <CalendarEntry when="9 - 10 am" event="PROGRAMMING FUNDAMENTALS WORKSHOP" />
                    <CalendarEntry when="9 - 10 am" event="DEVELOPING YOUR IDEA WORKSHOP" />
                    <CalendarEntry when="10 - 11:30 am" event="MEDITATION" />
                    <CalendarEntry when="10:30 - 11:30 am" event="INTRO TO WEB DEV WORKSHOP" />
                    <CalendarEntry when="11:30 am- 12 pm" event="MENTAL HEALTH TALK BY TINA CHAN" />
                    <CalendarEntry when="12 - 2 pm" event="LUNCH" />

                    <CalendarEntry when="1 - 2:30 pm" event="BACKEND PROGRAMMING WORKSHOP" />
                    <CalendarEntry when="2 - 4 pm" event="ICE CREAM" />
                    <CalendarEntry when="2 - 11:30 pm" event="HACKENGER HUNT" special/>
                    <CalendarEntry when="3 - 4:30 pm" event="DATA ANALYTICS WORKSHOP" />

                    <CalendarEntry when="3 - 4 pm" event="INTRO TO UI/UX DESIGN WORKSHOP" />
                    <CalendarEntry when="4 - 5:30 pm" event="MINUTE TO WIN IT" />
                    <CalendarEntry when="6 - 8 pm" event="DINNER" />
                    <CalendarEntry when="7 - 8:30 pm" event="REACT & JS WEB DEV WORKSHOP" />
                    <CalendarEntry when="7 - 8 pm" event="PITCHING YOUR IDEA WORKSHOP" />
                    <CalendarEntry when="7 - 8:30 pm" event="THERAPY DOGS" />

                    <br/>

                    <Text align="left" color="primary" type="display1" text="SUN 6" />
                    <CalendarEntry when="8 - 9:30 am" event="BREAKFAST" />
                    <CalendarEntry when="10 am - 4 pm" event="NETWORKING FAIR" special />
                    <CalendarEntry when="11 am" event="HACKING ENDS" special />
                    <CalendarEntry when="11 am" event="ACCOMMODATION CHECKOUT ENDS" special />
                    <CalendarEntry when="12 - 2 pm" event="LUNCH" />
                    <CalendarEntry when="12 - 3 pm" event="JUDGING" />
                    <CalendarEntry when="4 - 6 pm" event="CLOSING CEREMONIES & WINNERS ANNOUNCED" />
                </Paper>
            </div>
        );
    }
}

const CalendarEntry = ({ when, event, special }) => (
    <div className="split-column-row" style={{ padding: '20px' }}>
        <div style={{ gridArea: 'left' }}>
            <Text align="center" color="inherit" type="headline" text={<strong> {when} </strong>} />
        </div>
        <div style={{ gridArea: 'right' }}>
            { (special) ?
                <Text align="center" color="primary" type="headline" text={event} /> :
                <Text align="center" color="inherit" type="headline" text={event} />
            }
        </div>
    </div>
);
