import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import Text from '/client/ui/components/Text.js';


var dataScience = <span>
                    <li> <Text text={<span>Google account with <a href="https://cloud.google.com/bigquery/">BigQuery</a> set up. We will be within the free tier limits for this workshop</span> }/> </li>
                    <li> <Text text='Python (preferably v2.7)' /> </li>
                    <li> <Text text={<span><a href="http://www.numpy.org/">NumPy</a> (compatible with Python 2.7)</span> }/> </li>
                    <li> <Text text={<span><a href="https://pandas.pydata.org/">Pandas</a> (compatible with Python 2.7)</span> }/> </li>
                    <li> <Text text={<span><a href="http://scikit-learn.org/stable/">Scikit Learn</a> (compatible with Python 2.7)</span> }/> </li>
              </span>;

var design = <span>
                    <li> Sketch software would be a nice to have so you can follow along </li>
                    <li> <Text text={<span><a href="https://developer.apple.com/design/resources/">Apple Design Resources</a></span> } /> </li>
              </span>;

var react = <span>
                    <li> <Text text={<span>Download the slides <a href="http://arlenyu.com/equithon-react-slides">here</a></span> }/> </li>
                    <li> <Text text={<span>Clone <a href="https://github.com/arlen-yu/equithon-react-boilerplate">this</a> github repository if you want to follow along</span>} /> </li>
              </span>;
var android = <span>
                    <li> <Text text={<span>Android Studio. Instructions can be found <a href="https://developer.android.com/studio/install">here</a>.</span>} /> </li>
                    <li> <Text text={<span>Download the slides <a href="https://drive.google.com/open?id=1jon8Esu1aGA184uN84i1B6tJYEjTC4n4">here</a> and <a href="https://drive.google.com/open?id=1maZgk8vJyLTsHdyJ5MSOYryapNoRH2I6">here</a>.</span>} /> </li>
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

                    <br/>

                    <Text align="left" type="headline" color="primary" text='Introduction to Android Development' />
                    <Text align="left" type="body1" text="We will build from scratch an app to retrieve information from GitHub's REST API and list a user's repositories." />
                    <br/>
                    <Text align="left" type="body1" text="Materials:" />
                    <ul> <Text align="left" type="body1" text={android}/></ul>
                </Paper>
            </div>
        );
    }
}
