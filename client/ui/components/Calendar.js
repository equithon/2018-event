import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import Text from '/client/ui/components/Text.js';

export default class Calendar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="basic-page">
                <HomeAppBar />

                <div style={{ gridArea: 'title-row' }}>
                    <br/>
                    <Text align="center" color="primary" type="display2" text="Schedule" />
                    <br/>
                </div>

                <Paper style={{ gridArea: 'body', padding: '50px' }}>
                    <Text align="left" color="primary" type="display1" text="FRI 4" />
                    <CalendarEntry when="5:30 - 8 pm" event="REGISTRATION" />
                    <CalendarEntry when="6:30 - 8 pm" event="DINNER" />
                    <CalendarEntry when="8 - 9:30 pm" event="OPENING CEREMONIES" />
                    <CalendarEntry when="10 pm" event="HACKING BEGINS!" special />

                    <br/>

                    <Text align="left" color="primary" type="display1" text="SAT 5" />
                    <CalendarEntry when="8 - 9:30 am" event="BREAKFAST" />
                    <CalendarEntry when="8 - 11:30 pm" event="WORKSHOPS, ACTIVITIES, AND TALKS" special />
                    <CalendarEntry when="12 - 1:30 pm" event="LUNCH" />
                    <CalendarEntry when="6 - 7:30 pm" event="DINNER" />

                    <br/>

                    <Text align="left" color="primary" type="display1" text="SUN 6" />
                    <CalendarEntry when="8 - 9:30 am" event="BREAKFAST" />
                    <CalendarEntry when="10 am - 4 pm" event="NETWORKING FAIR" special />
                    <CalendarEntry when="11 am" event="HACKING ENDS" special />
                    <CalendarEntry when="12 - 1:30 pm" event="LUNCH" />
                    <CalendarEntry when="12 - 3 pm" event="JUDGING" />
                    <CalendarEntry when="4 pm - 6 pm" event="DINNER" />
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
