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
import { SuccessMessageChip, ErrorMessageChip } from '/client/ui/components/Accounts.js'; // This needs to better modularized
import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import ConfirmationModal from '/client/ui/components/ConfirmationModal.js';

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
        height: 'auto',
    },
    chipLabel: {
        paddingLeft: '0px',
        whiteSpace: 'normal',
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
        height: 'auto',
    },
    chipSuccessLabel: {
        whiteSpace: 'normal',
    },
});

class Apply extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            university: '',
            yog: 2017,
            project: '',

            /* Form field errors */
            ghURLError: '',
            liURLError: '',
            schoolError: '',
            yogError: '',
            projectError: '',

            success: false,
            successMessage: '',
            errorMessage: '',

            verified: true,
            submitted: false,

            confirmationModalOpen: false,
        };

        this.appValidationContext = clientSubmitSchema.newContext();

        this.handleFieldUpdate            = this.handleFieldUpdate.bind(this);
        this.submitApplication            = this.submitApplication.bind(this);
        this.saveApplication              = this.saveApplication.bind(this);
        this.handleConfirmationModalOpen  = this.handleConfirmationModalOpen.bind(this);
        this.handleConfirmationModalClose = this.handleConfirmationModalClose.bind(this);
    }

    /* Meteor.user is an asynchronous call so we need to hook into it and react to it */
    componentDidMount() {
        this.userC = Tracker.autorun(() => {
            let user = Meteor.user();
            this.setState({
                currentUser: user,

                // We only want to show the verified error message if they really are unverified.
                // The server checks if they are verified anyway before proceeding.
                verified: (user) ? user.emails[0].verified : true,
            });
        });

        this.appC = Tracker.autorun(() => {
            Meteor.subscribe('applicationData');

            let app = Applications.find().fetch()[0]
            if (app) {
                this.setState({
                    ghURL:   (app.ghURL) ? app.ghURL : '',
                    liURL:   (app.liURL) ? app.liURL : '',
                    school:  (app.school) ? app.school : '',
                    yog:     (app.yog) ? app.yog : '',
                    project: (app.project) ? app.project : '',
                    submitted: app.submitted,
                });
            }

            // Update state with any validation errors we see.
            if (!this.appValidationContext.isValid()) {
                console.log(this.appValidationContext.validationErrors());
                this.processValidationErrors(this.appValidationContext.validationErrors());
            }
        });
    }

    /* Unhook Meteor and React reactivity */
    componentWillUnmount() {
        this.userC.stop();
        this.appC.stop();
    }

    /* Submit Application */
    submitApplication() {
        let fullName = this.state.fullName;
        let university = this.state.university;
        let yearOfGraduation = Number(this.state.yog);
        let project = this.state.project;

        let submission = {};
        if (this.state.ghURL) submission.ghURL     = this.state.ghURL;
        if (this.state.liURL) submission.liURL     = this.state.liURL;
        if (this.state.school) submission.school   = this.state.school;
        if (this.state.yog) submission.yog         = Number(this.state.yog);
        if (this.state.project) submission.project = this.state.project;
        submission.submitted = false;

        if(Schema.context.validate(submission, Schema.application)) {
            Meteor.call('submitApplication', submission);
        } else {
            console.log("Error in submission");
        }
    }

    /* Save application */
    saveApplication() {
        this.clearErrorMessages();

        let application = {};
        if (this.state.ghURL) application.ghURL     = this.state.ghURL;
        if (this.state.liURL) application.liURL     = this.state.liURL;
        if (this.state.school) application.school   = this.state.school;
        if (this.state.yog) application.yog         = Number(this.state.yog);
        if (this.state.project) application.project = this.state.project;
        application.submitted = false;

        /*
         * Don't bother validating the schema on save, the server will validate it
         * and we don't have any need to tell the user of errors since they are
         * still working on it.
         */
        Meteor.call('applications.save', application, (err, res) => {
            // Simpl-schema server validation errors are thrown as meteor errors
            // with the actual errors in err.details
            if (err && err.error == "validation-error") {
                this.processValidationErrors(err.details);
            } else if (err) { // Non-validation Meteor error
                this.setState({
                    success: false,
                    errorMessage: err.reason,
                });
            } else {
                this.setState({
                    success: true,
                    successMessage: 'Your application was successfully saved',
                    errorMessage: '',
                });
            }
        });
    }


    handleFieldUpdate = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleConfirmationModalOpen = () => {
        this.setState({
            confirmationModalOpen: true,
        });
    };
    handleConfirmationModalClose = () => {
        this.setState({
            confirmationModalOpen: false,
        });
    };

    processValidationErrors(validationErrors) {
        if (validationErrors) {
            console.log(validationErrors);
            validationErrors.forEach((validationError) => {
                console.log(validationError);
                if (validationError.name) {
                    if (validationError.message) {
                        this.setState((state) => state[validationError.name + 'Error'] = validationError.message);
                    } else {
                        this.setState((state) => state[validationError.name + 'Error'] = validationError.type);
                    }
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
                            <FlatColoredButton
                                disabled={ this.state.submitted }
                                onClick={this.saveApplication}
                                content="Save"
                            />
                        </div>
                        <div style={{ gridArea: 'right', textAlign: 'center' }}>
                            <FlatColoredButton
                                disabled={ this.state.submitted }
                                onClick={this.handleConfirmationModalOpen}
                                content="Submit"
                            />
                            <ConfirmationModal
                                open={this.state.confirmationModalOpen}
                                onClose={this.handleConfirmationModalClose}
                                onYes={this.submitApplication}
                                message="Are you sure you would like to submit your application?"
                            />
                        </div>
                    </div>
                </Paper>
                <div className="footer"></div>
            </div>
        );
    }
}
export default withStyles(styles)(Apply);
