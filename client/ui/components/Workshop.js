import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import Text from '/client/ui/components/Text.js';


var dataScience = <span>
                    <li> <Text text='Google account with BigQuery set up (https://cloud.google.com/bigquery/). We will be within the free tier limits for this workshop' /> </li>
                    <li> <Text text='Python (preferably v2.7)' /> </li>
                    <li> <Text text='NumPy (compatible with Python 2.7): http://www.numpy.org/' /> </li>
                    <li> <Text text='Pandas (compatible with Python 2.7): https://pandas.pydata.org/' /> </li>
                    <li> <Text text='Scikit Learn (compatible with Python 2.7): http://scikit-learn.org/stable/' /> </li>
              </span>;

var design = <span>
                    <li> Sketch software would be a nice to have so you can follow along </li>
                    <li> <Text text='https://developer.apple.com/design/resources/' /> </li>
              </span>;

var react = <span>
                    <li> <Text text='Download the slides: http://arlenyu.com/equithon-react-slides' /> </li>
                    <li> <Text text='Clone this github repository if you want to follow along: https://github.com/arlen-yu/equithon-react-boilerplate' /> </li>
              </span>;

/*
 * Workshop page for information
 * ------ PLACEHOLDER ------
 */
export default class Workshop extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="basic-page">
                <HomeAppBar />

                <Text style={{ gridArea: 'title-row', paddingTop: '10px' }}
                     align="center" color="primary" type="display2" text="Workshop Materials" />

                <Paper className="form-paper">
                    <Text align="left" type="headline" color="primary" text='Intro to Data Analytics' />
                    <Text align="left" type="body1" text='Learn about the fundamentals on what it means to be a data analyst, what a day may look like, and work through some simple, real life examples using a variety of data tools. This workshop is suited for those who may not have any data analytics experience, but do have some core fundamentals in computer science.' />
                    <br/>
                    <Text align="left" type="body1" text='Materials:' />
                    <ul> <Text align="left" type="body1" text={dataScience}/></ul>
                    <br/>
                    <Text align="left" type="headline" color="primary" text='UI/UX Design - Designing for iOS' />
                    <Text align="left" type="body1" text='Explore visual design, UI, UX and tips for today’s App Store.' />
                    <br/>
                    <Text align="left" type="body1" text='Materials:' />
                    <ul> <Text align="left" type="body1" text={design}/></ul>
                    <br/>
                    <Text align="left" type="headline" color="primary" text='React & JS - You Should Probably Learn React.js' />
                    <Text align="left" type="body1" text="An introduction to React.js, and why it's dominating front end development." />
                    <br/>
                    <Text align="left" type="body1" text='Materials:' />
                    <ul> <Text align="left" type="body1" text={react}/></ul>
                </Paper>
            </div>
        );
    }
}
