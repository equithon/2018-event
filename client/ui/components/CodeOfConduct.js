import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

import Text from "/client/ui/components/Text.js";
import HomeAppBar from '/client/ui/components/HomeAppBar.js';

var bullets = <span>
                    <li> Participate in an authentic and active way. In doing so, you contribute to the health and longevity of this community. </li>
                    <li> Exercise consideration and respect in your speech and actions. </li>
                    <li> Attempt collaboration before conflict. </li>
                    <li> Refrain from demeaning, discriminatory, or harassing behavior and speech. </li>
                    <li> Be mindful of your surroundings and of your fellow participants. </li>
              </span>;


export default class CodeOfConduct extends Component {
    constructor(props) {
        super(props);
    }


    /***** Rendering *****/
    /* Rendering entry point */
    render() {
        const { classes } = this.props;

    	return(
    		<div id="conduct-wrapper">
    		    <HomeAppBar />
                <div style={{gridArea: 'title-row'}}>
                    <Text style={{ textAlign: 'center', gridRowGap: '10px', paddingBottom: '10px' }} color="primary" type="display2"
                        text={ 'Equithon Code of Conduct' } />
                </div>
    		    <Paper id="conduct-page" style={{ gridArea: 'content-row', textAlign: 'left'}}>
                    <Text align="left" type="body1" text='Our Code of Conduct is our commitment to the community to provide a welcoming, safe space for all its participants.' />
                    <br/>

                    <Text align="left" type="headline" color="primary" text='Purpose' />
                    <Text align="left" type="body1" text='A primary goal of the Equithon Organizing Committee is to be inclusive towards and supportive of everyone, regardless of gender, sexual orientation, race, religion, or disability. Additionally, we seek to include and support members of all underrepresented groups in STEM fields, with the most varied and diverse backgrounds possible. As such, we are committed to providing a friendly, safe and welcoming environment for all, regardless of gender, sexual orientation, ability, ethnicity, socioeconomic status, and religion (or lack thereof).' /> 
                    <Text align="left" type="body1" text='We invite all those who participate in our events and who communicate with our community at large to help us create a safe and positive experience for everyone involved.' />
                    <Text align="left" type="body1" text='We have outlined a code of conduct to highlight our expectations for all individuals who participate in our community, as well as the steps to handle unacceptable behavior.' />
                    <br/>

                    <Text align="left" type="headline" color="primary" text='Expected Behaviour' />
                    <ul> <Text align="left" type="body1" text={bullets}/></ul>
                    <Text align="left" type="body1" text='If you notice a dangerous situation, someone in distress, or violations of this Code of Conduct, contact the committee. No situation is considered inconsequential. If you do not feel comfortable contacting the committee at large due to the nature of the incident, you may contact Jo Atlee, Director of Women in Computer Science.' />
                    <br/>

                    <Text align="left" type="headline" color="primary" text='Unacceptable Behaviour' />
                    <Text align="left" type="body1" text='Unacceptable behaviors include: intimidating, harassing, abusive, discriminatory, derogatory or demeaning speech or actions by any participant in our community online, at all related events and in one-on-one communications carried out in the context of community business. Community event venues may be shared; please be respectful to all patrons of these locations. Harassment includes: harmful or prejudicial verbal or written comments related to gender, sexual orientation, race, religion, disability; inappropriate use of nudity and/or sexual images in public spaces (including presentation slides); deliberate intimidation, stalking or following; harassing photography or recording; sustained disruption of talks or other events; inappropriate physical contact, and unwelcome sexual attention.'/>
                    <br/>

                    <Text align="left" type="headline" color="primary" text='Consequences of Unacceptable Behaviour' />
                    <Text align="left" type="body1" text='Unacceptable behavior from any community member, including sponsors and those with decision-making authority, will not be tolerated. Anyone asked to stop unacceptable behavior is expected to comply immediately. If a community member engages in unacceptable behavior, the community organizers may take any action they deem appropriate, up to and including a temporary ban or permanent expulsion from the community without warning (and without refund in the case of a paid event).' />
                    <br/>

                    <Text align="left" type="headline" color="primary" text='Experiencing Unacceptable Behavior' />
                    <Text align="left" type="body1" text='If you are subject to or witness unacceptable behavior, or have any other concerns, please notify an organizer as soon as possible (contact info below). Additionally, community organizers are available to help community members engage with local law enforcement or to otherwise help those experiencing unacceptable behavior feel safe. In the context of in-person events, organizers will also provide escorts as desired by the person experiencing distress.' />
                    <br/>

                    <Text align="left" type="headline" color="primary" text='Addressing Grievances' />
                    <Text align="left" type="body1" text='If you feel you have been falsely or unfairly accused of violating this Code of Conduct, you should contact Jo Atlee, Director of Women in Computer Science, with a concise description of your grievance.' />
                    <br/>

                    <Text align="left" type="headline" color="primary" text='Scope' />
                    <Text align="left" type="body1" text='We expect all community participants (participants, organizers, sponsors, and other guests) to abide by this Code of Conduct in all community venues—online and in-person—as well as in all one-on-one communications pertaining to community business.' />
                    <br/>

                    <Text align="left" type="headline" color="primary" text='Contact Information' />
                    <Text align="left" type="body1" text={ <span>Equithon Organizing Committee <a href="mailto:hello@equithon.org">(hello@equithon.org)</a>.</span> } />
                    <Text align="left" type="body1" text={ <span>Jo Atlee, Director of Women in Computer Science <a href="mailto:jmatlee@uwaterloo.ca">(jmatlee@uwaterloo.ca)</a>.</span> } />
                    <br/>

                    <Text align="left" type="headline" color="primary" text='License Information and Attribution' />
                    <Text align="left" type="body1" text={<span> This Code of Conduct is distributed under a <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike license</a>, derived from the <a href="http://opensourcebridge.org/about/code-of-conduct/">Open Source Bridge Code of Conduct</a>. </span> } />
                </Paper>
                <div className="footer"></div>
            </div>
    	);
    }
}