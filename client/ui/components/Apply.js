import React, { Component } from 'react';
import {Button, TextField} from "material-ui";
import Text from "./Text";
import Schema from "../../../common/Schema"
import SimpleSchema from 'simpl-schema';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import Text from "/client/ui/components/Text.js";
import FlatColoredButton from '/client/ui/buttons/FlatColoredButton.js';
import { ErrorMessageChip } from '/client/ui/components/Accounts.js'; // This needs to better modularized
import HomeAppBar from '/client/ui/components/HomeAppBar.js';

import { clientSubmitSchema } from '/imports/api/Schema.js';


const Applications = new Mongo.Collection('applications');

const unverifiedMessage = "Your account is not verified! Please verify your email address in order to submit your application.";
const styles = theme => ({
    /* Text Fields */
    textFieldInput: {
        padding: '10px 12px',
    },
    longTextFieldRoot: {
        padding: 0,
    },
    longTextFieldInput: {
        padding: '10px 12px',
        backgroundColor: theme.palette.primary['A200'],
        borderRadius: '5px',
        border: '1px solid ' + theme.palette.primary[500],
    },

    /* Error Chip */
    chipRoot: {
        backgroundColor: 'rgba(127, 10, 10, 0.76)',
        paddingTop: '3px',
    },
    chipLabel: {
        paddingLeft: '0px',
    },
    chipAvatarRoot: {
        margin: 5,
        textAlign: 'center',
        color: theme.palette.common.white,
        backgroundColor: 'transparent',
    },

    /* Success Chip */
    chipSuccessRoot: {
        backgroundColor: 'green',
        paddingTop: '3px',
    },
});

class Apply extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            university: '',
            yog: 2017,
            project: ''
        };
    }

    submitApplication() {
        let fullName = this.state.fullName;
        let university = this.state.university;
        let yearOfGraduation = Number(this.state.yog);
        let project = this.state.project;

        let submission = {
            name: fullName,
            school: university,
            yog: yearOfGraduation,
            project: project,
        };
        console.log("Submitting application: " + submission);

        if(Schema.context.validate(submission, Schema.application)) {
            Meteor.call('submitApplication', submission);
        } else {
            console.log("Error in submission");
        }
    }


    handleFieldUpdate(event) {
        event.persist();
        this.setState((state) => state[event.target.name] = event.target.value);
    }


    handleFieldUpdate = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    processValidationErrors(validationErrors) {
        if (validationErrors) {
            validationErrors.forEach((validationError) => {
                if (validationError.name) {
                    this.setState((state) => state[validationError.name + 'Error'] = validationError.message);
                }
            }, this);
        }
    }

    getUserField(field) {
        return (this.state.currentUser && this.state.currentUser[field]);
    }

    clearErrorMessages() {
        this.setState({
            ghURLError: '',
            liURLError: '',
            schoolError: '',
            yogError: '',
            projectError: '',
        });
    }

    getApplicationStatus() {
        if (this.state.submitted) return 'Submitted';
        return 'Incomplete';
    }


    render() {
        return(
            <div id="application-form-wrapper">
                <HomeAppBar />

                {/* Welcome the name of the user */}
                <div style={{gridArea: 'title-row'}}>
                    <Text style={{ textAlign: 'center' }} color="primary" type="display2"
                        text={ 'Welcome, ' + this.getUserField('firstName') + ' ' + this.getUserField('lastName') } />
                </div>

                {/* Display application submission status and any errors that occur */}
                <div style={{ gridArea: 'application-label-row', paddingTop: '30px' }}>
                    <Text align="left" color="primary" type="title"
                        text={ <div>Application > <em>{ this.getApplicationStatus() }</em></div> } />

                    {/* Informative chips */}
                    <div style={{ display: 'grid', gridRowGap: '10px', padding: '10px' }}>
                        {/* User not verified */}
                        { (!this.state.verified) ?
                                <ErrorMessageChip classes={classes} errorMessage={unverifiedMessage} /> : false
                        }

                        {/* Submission server error */}
                        { (this.state.errorMessage) ?
                                <ErrorMessageChip classes={classes} errorMessage={this.state.errorMessage} /> : false
                        }

                        {/* Successful operation */}
                        { (this.state.success) ?
                                <SuccessMessageChip classes={classes} successMessage={this.state.successMessage} /> : false
                        }
                    </div>
                </div>

                {/* Actual application */}
                <Paper id="application-form">
                    {/* Personal info form fields */}
                    <div style={{gridArea: 'personal-info-row'}}>
                        <Text align="left" color="primary" type="headline" text="Personal Info" />

                        {/* Github Field */}
                        <TextField
                            name="ghURL"
                            label="Github URL"
                            margin="normal"
                            fullWidth
                            InputProps={{ classes: {
                                input: classes.textFieldInput,
                            }}}
                            onChange={this.handleFieldUpdate('ghURL')}

                            error={ !!this.state.ghURLError }
                            helperText={this.state.ghURLError}
                            value={this.state.ghURL}
                        /><br/>

                        {/* Linkedin Field */}
                        <TextField
                            name="liURL"
                            label="LinkedIn URL"
                            margin="normal"
                            fullWidth
                            InputProps={{ classes: {
                                input: classes.textFieldInput,
                            }}}
                            onChange={this.handleFieldUpdate('liURL')}

                            error={ !!this.state.liURLError }
                            helperText={this.state.liURLError}
                            value={this.state.liURL}
                        /><br/>

                        {/* School Field */}
                        <TextField
                            name="school"
                            label="Your University"
                            margin="normal"
                            fullWidth
                            InputProps={{ classes: {
                                input: classes.textFieldInput,
                            }}}
                            onChange={this.handleFieldUpdate('school')}

                            error={ !!this.state.schoolError }
                            helperText={this.state.schoolError}
                            value={this.state.school}
                        /><br/>

                        {/* Graduation Field */}
                        <TextField
                            name="yog"
                            label="Year of Graduation"
                            margin="normal"
                            type="number"
                            InputProps={{ classes: {
                                input: classes.textFieldInput,
                            }}}
                            onChange={this.handleFieldUpdate('yog')}

                            error={ !!this.state.yogError }
                            helperText={this.state.yogError}
                            value={''+this.state.yog}
                        /><br/>
                    </div>

                    <div style={{gridArea: 'long-answer-row'}}>
                        <Text align="left" color="primary" type="headline" text="Long Answer" />
                        <TextField
                            name="project"
                            value={ (this.state.project) ? this.state.project: '' }
                            onChange={this.handleFieldUpdate('project')}
                            multiline={true}
                            rows="10"
                            fullWidth={true}
                            InputProps={{
                                disableUnderline: true,
                                classes: {
                                    root: classes.longTextFieldRoot,
                                    input: classes.longTextFieldInput,
                                }
                            }}
                            InputLabelProps={{
                                shrink: true,
                                fontSize: '8vw',
                            }}

                            error={ !!this.state.projectError }
                            helperText={this.state.projectError}
                            placeholder="Tell us about a project that you think is cool that you've worked on in the last year"
                        /><br/><br/>
                    </div>

                    <div className="split-column-row" style={{ gridArea: 'submit-row', gridRowGap: '10px' }}>
                        <div style={{ gridArea: 'left', textAlign: 'center' }}>
                            <FlatColoredButton onClick={this.saveApplication} content="Save" />
                        </div>
                        <div style={{ gridArea: 'right', textAlign: 'center' }}>
                            <FlatColoredButton onClick={this.submitApplication} content="Submit" />
                        </div>
                    </div>
                </Paper>
                <div className="footer"></div>
            </div>
        );
    }
}
