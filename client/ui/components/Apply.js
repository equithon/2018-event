import React, { Component } from 'react';

import { Redirect } from 'react-router';
import SimpleSchema from 'simpl-schema';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';

import Text from "/client/ui/components/Text.js";
import FlatColoredButton from '/client/ui/buttons/FlatColoredButton.js';
import { SuccessMessageChip, ErrorMessageChip } from '/client/ui/components/Accounts.js'; // This needs to better modularized
import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import ConfirmationModal from '/client/ui/components/ConfirmationModal.js';

import { clientSubmitSchema } from '/imports/api/Schema.js';


const Applications = new Mongo.Collection('applications');


/*
 * Words for the application from
 */
/* Education Level drop down menu options stored as arrays */
const eduLevelSelect = {
    values: [
        '',
        'highschool',
        'undergrad',
        'grad',
        'college',
        'other',    // Can be used by onChange callback to render a new TextField
    ],
    messages: [
        '',
        'High School',
        'University Undergraduate',
        'University Graduate',
        'College',
        'Other',
    ],
};

const longAnswerText = "What is an equity issue you are passionate about and want to take action to solve? Why is tackling this issue important to you? (Try to keep your response to 400 words or less)";

const unverifiedMessage = "Your account is not verified! Please verify your email address in order to submit your application.";


const styles = theme => ({
    /* Text Fields */
    textFieldInput: {
        padding: '3px 12px',
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
            /* Form fields */
            program: '',
            yog: 2018,
            longAnswer: '',
            institution: '',
            travellingFrom: '',
            cityOfInstitution: '',
            eduLevel: '',


            /* Form field errors */
            programError: '',
            yogError: '',
            longAnswerError: '',
            institutionError: '',
            travellingFromError: '',
            cityOfInstitutionError: '',
            eduLevelError: '',

            /* Other field produced after choosing the option in a Select */
            eduLevelOther: false,
            eduLevelOtherText: '',

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

            let app = Applications.find().fetch()[0];
            if (app) {
                this.setState({
                    program:  (app.program) ? app.program : '',
                    yog:     (app.yog) ? app.yog : '',
                    longAnswer: (app.longAnswer) ? app.longAnswer : '',
                    institution: (app.institution) ? app.institution : '',
                    cityOfInstitution: (app.cityOfInstitution) ? app.cityOfInstitution : '',
                    travellingFrom: (app.travellingFrom) ? app.travellingFrom : '',
                    eduLevel: (app.eduLevel) ? app.eduLevel : '',
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
        if (this.state.program) submission.program                     = this.state.program;
        if (this.state.yog) submission.yog                             = Number(this.state.yog);
        if (this.state.longAnswer) submission.longAnswer               = this.state.longAnswer;
        if (this.state.institution) submission.institution             = this.state.institution;
        if (this.state.cityOfInstitution) submission.cityOfInstitution = this.state.cityOfInstitution;
        if (this.state.travellingFrom) submission.travellingFrom       = this.state.travellingFrom;
        if (this.state.eduLevel) submission.eduLevel                   = this.state.eduLevel;
        submission.submitted = false;

        /* Validate the submission on submit which will reactively display errors to the user */
        if(this.appValidationContext.validate(submission, clientSubmitSchema.application)) {
            Meteor.call('applications.submit', submission, (err, res) => {
                if (err && err.error == 'validation-error') {
                    this.processValidationError(err.details);
                } else if (err) this.setState({
                    success: false,
                    successMessage: '',
                    errorMessage: err.reason,
                });
                else this.setState({
                    success: true,
                    successMessage: 'Your application was successfully submitted',
                    errorMessage: '',
                });
            });
        } else this.setState({ success: false });   // Remove any success messages validation fails
    }

    /* Save application */
    saveApplication() {
        this.clearErrorMessages();

        let application = {};
        if (this.state.program) application.program   = this.state.program;
        if (this.state.yog) application.yog         = Number(this.state.yog);
        if (this.state.longAnswer) application.longAnswer = this.state.longAnswer;
        if (this.state.institution) application.institution = this.state.institution;
        if (this.state.cityOfInstitution) application.cityOfInstitution = this.state.cityOfInstitution;
        if (this.state.travellingFrom) application.travellingFrom = this.state.travellingFrom;
        if (this.state.eduLevel) application.eduLevel = this.state.eduLevel;
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
                    successMessage: '',
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
        if (!this.state.submitted) {
            this.setState({
                [name]: event.target.value,
            });
        }
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
            validationErrors.forEach((validationError) => {
                if (validationError.name) {
                    if (validationError.message) {
                        this.setState((state) => state[validationError.name + 'Error'] = validationError.message);
                    } else {
                        this.setState((state) => state[validationError.name + 'Error'] = validationError.type);
                    }
                }
            }, this);
            this.setState({ errorMessage: "Some fields require your attention" });
        }
    }

    getUserField(field) {
        return (this.state.currentUser && this.state.currentUser[field]);
    }

    clearErrorMessages() {
        this.setState({
            programError: '',
            yogError: '',
            longAnswerError: '',
            cityOfInstitutionError: '',
            institutionError: '',
            travellingFromError: '',
        });
    }

    getApplicationStatus() {
        return (this.state.submitted) ? 'Submitted' : 'Incomplete';
    }

    /************** Rendering **************/
    /* Render the EduLevel Select dropdown */
    renderEduLevelHelper(classes) {
        var options = [];
        for (var i = 0; i < eduLevelSelect.values.length; ++i) {
            options.push(
                <option key={i} value={eduLevelSelect.values[i]}>{eduLevelSelect.messages[i]}</option>
            );
        }

        return(
            <SelectField
                value={this.state.eduLevel}
                onChange={ (event) => { // Override handleFieldUpdate
                    if (!this.state.submitted) {
                        if (event.target.value === 'other') {
                            this.setState({ // Render the 'other' TextField and let eduLevel control it.
                                eduLevelOther: true,
                                eduLevel: 'other',
                            });
                        } else {
                            this.setState({ eduLevel: event.target.value });
                        }
                    }
                }}
                error={this.state.eduLevelError}
                options={options}
            />
        );
    }

    render() {
        const { classes } = this.props;

        if (!Meteor.userId()) return <Redirect to="/accounts/login" />;

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
                    <div style={{ display: 'grid', gridRowGap: '10px', padding: '10px', justifyContent: 'center' }}>
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
                    <div style={{display: 'grid', gridRowGap: '10px', gridTemplateRows: 'auto', gridArea: 'personal-info-row'}}>
                        <Text align="left" color="primary" type="headline" text="Personal Info" />

                        {/*// TODO DROPDOWN GENDER*/}

                        {/* Education Level Select Field */}
                        <Text type="body2" text="Which level of education are you currently attending?" />
                        {this.renderEduLevelHelper(classes)}
                        { (this.state.eduLevelOther) ?
                            <TextInputField classes={classes} fullWidth value={this.state.eduLevelOtherText}
                                onChange={this.handleFieldUpdate('eduLevel')} error={this.state.eduLevelError}
                            /> : false
                        }

                        {/* Test select field */}

                        {/* Program of Study Field */}
                        <Text type="body2" text="What program of study are you currently enrolled in?" />
                        <TextInputField classes={classes} fullWidth value={this.state.program}
                            onChange={this.handleFieldUpdate('program')} error={this.state.programError} /><br/>

                        {/* Graduation Field */}
                        <Text type="body2" text="On what year do you graduate?" />
                        <TextInputField classes={classes} type="number" value={this.state.yog}
                            onChange={this.handleFieldUpdate('yog')} error={this.state.yogError} /><br/>

                        {/* Institution Field */}
                        <Text type="body2" text="What institution do you attend?" />
                        <TextInputField classes={classes} fullWidth value={this.state.institution}
                            onChange={this.handleFieldUpdate('institution')} error={this.state.institutionError} /><br/>

                        {/* City Institution Field */}
                        <Text type="body2" text="Where is your institution located? (City, Country)" />
                        <TextInputField classes={classes} fullWidth value={this.state.cityOfInstitution}
                            onChange={this.handleFieldUpdate('cityOfInstitution')} error={this.state.cityOfInstitutionError} /><br/>

                        {/* Travelling From Field */}
                        <Text type="body2" text="Where would you be travelling from to attend Equithon on May 4-6, 2018? (City, Country)" />
                        <TextInputField classes={classes} fullWidth value={this.state.travellingFrom}
                            onChange={this.handleFieldUpdate('travellingFrom')} error={this.state.travellingFromError} /><br/>

                        {/*// TODO RADIO BUTTON CODING EXPERIENCE*/}

                        {/*// TODO RADIO BUTTON ATTENDED HACKATHON*/}

                        {/*// TODO CHECKBOX GOALS FOR E2018*/}

                        {/*// TODO CHECKBOX INTERESTED CATEGORIES*/}

                        {/*// TODO CHECKBOX WORKSHOPS*/}

                        {/*// TODO RADIO BUTTON HEAR ABOUT EQUITHON*/}
                    </div>

                    <div style={{gridArea: 'long-answer-row'}}>
                        <Text align="left" color="primary" type="headline" text="Long Answer" />

                        <Text type="body2" text={longAnswerText} />
                        <LongInputField classes={classes} value={this.state.longAnswer}
                        onChange={this.handleFieldUpdate('longAnswer')} error={this.state.longAnswerError} />
                    </div>

                    <div style={{ gridArea: 'submit-row' }}>
                        {/* Informative chips */}
                        <div style={{ display: 'grid', gridRowGap: '10px', padding: '10px', justifyContent: 'center' }}>
                            {/* Submission server error */}
                            { (this.state.errorMessage) ?
                                    <ErrorMessageChip classes={classes} errorMessage={this.state.errorMessage} /> : false
                            }

                            {/* Successful operation */}
                            { (this.state.success) ?
                                    <SuccessMessageChip classes={classes} successMessage={this.state.successMessage} /> : false
                            }
                        </div>

                        <div className="split-column-row" style={{ gridRowGap: '10px' }}>
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
                                    message="Are you sure you would like to submit your application? You cannot edit after submitting."
                                />
                            </div>
                        </div>
                    </div>
                </Paper>
                <div className="footer"></div>
            </div>
        );
    }
}
export default withStyles(styles)(Apply);

const TextInputField = ({ classes, label, type, fullWidth, value, onChange, error }) => (
    <TextField
        type={type}
        fullWidth={fullWidth}
        InputProps={{ classes: {
            input: classes.textFieldInput,
        }}}
        onChange={onChange}

        error={ !!error }
        helperText={error}
        value={value}
    />
);

const SelectField = ({ label, value, onChange, error, options }) => (
    <FormControl error={ !!error } fullWidth>
        <Select
            native
            input={<Input />}
            onChange={onChange}

            value={value}
        >
            {options}
        </Select>
        { (error) ? <FormHelperText>{error}</FormHelperText> : false }
    </FormControl>
);

const LongInputField = ({ classes, label, value, onChange, error}) => (
    <TextField
        value={value}
        onChange={onChange}
        multiline
        fullWidth
        rows="15"
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

        error={ !!error }
        helperText={error}
    />
);
