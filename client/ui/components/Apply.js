import React, { Component } from 'react';

import { Tracker } from 'meteor/tracker';

import { Link, Redirect } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';

import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import Select from 'material-ui/Select';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel, FormLabel, FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';

import { appsClosed } from '/imports/api/AppCloseDate.js';

import Text from "/client/ui/components/Text.js";
import FlatColoredButton from '/client/ui/components/buttons/FlatColoredButton.js';
import SuccessMessageChip from '/client/ui/components/notif-chips/SuccessMessageChip.js';
import ErrorMessageChip from '/client/ui/components/notif-chips/ErrorMessageChip.js';
import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import ConfirmationModal from '/client/ui/components/modals/ConfirmationModal.js';
import AlertBox from '/client/ui/components/notif-chips/AlertBox.js';

import { clientSubmitSchema } from '/imports/api/Schema.js';



/* Application form field names */
const textFieldNames = [ 'program', 'longAnswer', 'institution', 'travellingFrom',
    'cityOfInstitution' ];
const numberFieldNames = [ 'yog' ];
const selectFieldNames = [ 'eduLevel', 'gender' ];
const checkboxFieldNames = [ 'goals' ];
=======
const selectFieldNames = [ 'eduLevel', 'gender', 'experience', 'hackathon', 'hearAbout' ];
const checkboxFieldNames = [ 'goals', 'categories', 'workshops' ];
>>>>>>> Added rest of questions

/*
 * Words for the application from
 *
 * Note that the names of these objects are heavily relied on by the code (the 'ValuesAndMessages' suffix).
 * Be careful changing them.
 */
/* Drop down menu options stored as arrays */
export const valuesAndMessages = {
    eduLevel: {
        values: [ '', 'highschool', 'undergrad', 'grad', 'college', 'other', ],
        messages: [ '', 'High School', 'University Undergraduate', 'University Graduate', 'College', 'Other', ],
    },
    gender: {
        values: [ '', 'female', 'male', 'nonbinary', 'no', 'other', ],
        messages: [ '', 'Female', 'Male', 'Non-binary', 'Prefer not to specify', 'Other', ],
    },
=======
    },

    /* Checkbox texts */
    goals: {    // Values correspond to messages below in order
        values: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ],
        messages: [
            'I want to learn to code',
            'I want to learn new technologies',
            'I want to improve my design skills',
            'I want to learn about equity issues',
            'I want a comfortable introduction to hackathons',
            'I want to meet new people',
            'I want to talk to recruiters',
        ],
>>>>>>> Add checkbox field
    },
    categories: {
        values: [ 'a', 'b', 'c', 'd', 'e' ],
        messages: [
            'Access to Education',
            'LGBTQ+ Rights',
            'Mental Health',
            'Physical Disabilities',
            'Women Empowerment',
        ],
    },
    workshops: {
        values: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm' ],
        messages: [
            'Programming Basics Workshop',
            'Game Development Workshop',
            'Web Development Workshop',
            'Android Development Workshop',
            'iOS Development Workshop',
            'Raspberry Pi Workshop',
            'UX/UI Design Workshop',
            'Idea Development Workshop',
            'Pitching Workshop',
            'Mental Health Workshop',
            'Virtual/Augmented Reality Workshop',
            'Computer Vision Workshop',
            'Machine Learning Workshop',
        ],
    }
};

/* Questions */
const genderQuestion = "What gender do you identify as? (This will not be taken into account when reviewing the application)";
export const experienceQuestion = "How would you describe your coding experience?";
export const hackathonQuestion = "Have you attended a hackathon before?";
export const hearAboutQuestion = "How did you hear about Equithon?";
export const goalsQuestion = "What do you want to do at Equithon 2018? Choose as many as you like.";
export const categoriesQuestion = "The categories for Equithon 2018 are listed below. Choose all the categories you would be interested in creating a hack for.";
export const workshopsQuestion = "What kinds of workshops would you be likely to attend at Equithon 2018? Choose as many as you like."
export const longAnswerQuestion = "What is an equity issue you are passionate about and want to take action to solve? Why is tackling this issue important to you? (Try to keep your response to 400 words or less)";

const unverifiedMessage = <p>Please verify your email address in order to submit your application. Click <a style={{ color: 'white' }} href="/accounts/verify-email">here</a> to resend.</p>;


// Whether or not applications have closed
const closed = appsClosed();


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

        this.state = {  // Can we turn this into a loop?
            /* Form fields */
            program: '',
            yog: 2018,
            longAnswer: '',
            institution: '',
            travellingFrom: '',
            cityOfInstitution: '',
            eduLevel: '',
            gender: '',
            goals: { a: false, b: false, c: false, d: false, e: false, f: false, g: false },
            categories: { a: false, b: false, c: false, d: false, e: false },
            workshops: { a: false, b: false, c: false, d: false, e: false, f: false,
                         g: false, h: false, i: false, j: false, k: false, l: false, m: false },

            /* Form field errors */
            programError: '',
            yogError: '',
            longAnswerError: '',
            institutionError: '',
            travellingFromError: '',
            cityOfInstitutionError: '',
            eduLevelError: '',
            genderError: '',
            goalsError: '',
            categoriesError: '',
            workshopsError: '',

            /* Other field produced after choosing the 'other' option in a Select */
            eduLevelText: '',
            genderText: '',
            hearAboutText: '',

            /* Success flags */
            success: false,
            successMessage: '',
            errorMessage: '',

            verified: true, // Default verification status so we don't unnecessarily warn the user
            submitted: false,
            accepted: undefined,

            loaded: false,  // Whether or not the application is done loading

            confirmationModalOpen: false,
        };

        /* Initialize a new validation context to react to */
        this.appValidationContext = clientSubmitSchema.newContext();

        /* Bindings */
        this.handleFieldUpdate            = this.handleFieldUpdate.bind(this);
        this.submitApplication            = this.submitApplication.bind(this);
        this.saveApplication              = this.saveApplication.bind(this);
        this.handleConfirmationModalOpen  = this.handleConfirmationModalOpen.bind(this);
        this.handleConfirmationModalClose = this.handleConfirmationModalClose.bind(this);
    }

    /* Meteor.user is an asynchronous call so we need to hook into it and react to it */
    componentDidMount() {
        /* User computations - we keep track of Meteor's user here and hook it into our component */
        this.userC = Tracker.autorun(() => {
            let user = Meteor.user();
            this.setState({
                currentUser: user,

                // We only want to show the verified error message if they really are unverified.
                // The server checks if they are verified anyway before proceeding.
                verified: (user) ? user.emails[0].verified : true,
            });
        });

        /* Application computations - we keep track of the fields published by the server and hook into them */
        this.appC = Tracker.autorun(() => {
            Meteor.subscribe('applicationData');

            let app = Applications.findOne({});
            if (app) {
                textFieldNames.forEach((name) => this.setState({ [name]: (app[name]) ? app[name] : '' }));
                numberFieldNames.forEach((name) => this.setState({ [name]: (app[name]) ? app[name] : '' }));
                checkboxFieldNames.forEach((name) => {
                    for (var checkProp in app[name]) {
                        this.setState({ [name]: { ...this.state[name], [checkProp]: app[name][checkProp] }});
                    }
                });

                /* Handle additional select outcomes */
                selectFieldNames.forEach((name) => this.initSelectState(valuesAndMessages[name], app[name], name));

                console.log(app);

                this.setState({
                    submitted: app.submitted,
                    accepted: app.accepted,
                    loaded: true
                });
            }
        });
    }

    /* Unhook Meteor and React reactivity */
    componentWillUnmount() {
        this.userC.stop();
        this.appC.stop();
    }

    /***** Event Handlers *****/
    /* Handle Submit Application event*/
    submitApplication() {
        let fullName = this.state.fullName;
        let university = this.state.university;
        let yearOfGraduation = Number(this.state.yog);
        let project = this.state.project;

        let submission = this.getClientApplication();

        // We don't care about errors since we're going to validate on submission anyway
        Meteor.call('applications.save', submission);

        /* Validate the submission client-side which will reactively display errors to the user */
        if(this.appValidationContext.validate(submission, clientSubmitSchema.application)) {
            Meteor.call('applications.submit', submission, (err, res) => {
                if (err && err.error == 'validation-error') {
                    this.processValidationErrors(err.details);
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
        } else {   // Remove any success messages validation fails - Unlike saving, we care about validation.
          this.processValidationErrors(this.appValidationContext.validationErrors());
        }
    }

    /* Handle Save application evnet */
    saveApplication() {
        this.clearErrorMessages();

        let application = this.getClientApplication();

        /*
         * Don't bother validating the schema client-side on save, the server will validate it
         * and we don't have any need to tell the user of errors since they are
         * still working on it.
         * - We still want to process any validation errors the server ends up throwing at us.
         */
        Meteor.call('applications.save', application, (err, res) => {
            if (err && err.error == 'validation-error') {
                this.processValidationErrors(err.details);
            } else if (err) {
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

    /* General purpose onChange handler */
    handleFieldUpdate = name => event => {
        if (!this.state.submitted && !closed) {
            this.setState({
                [name]: event.target.value,
            });
        }
    };

    /* onChange handler for Checkboxes */
    handleCheckedUpdate = name => (event, checked) => {
        if (!this.state.submitted && !closed) {
            this.setState({
                [name]: {   // MERGE [event.target.value into this.state[name] rather than replace
                    ...this.state[name], [event.target.value]: checked
                }
            });
        }
    };

    /* ConfirmationModal event handlers */
    handleConfirmationModalOpen  = () => this.setState({ confirmationModalOpen: true, });
    handleConfirmationModalClose = () => this.setState({ confirmationModalOpen: false, });


    /***** Helpers *****/
    /* Process any validation errors given by setting the corresponding state, rerendering the components */
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

            this.setState({
              success: false,
              errorMessage: 'Some fields require your attention',
              successMessage: '',
            });
        }
    }

    /* Returns the application in its current state on the client */
    getClientApplication() {
        var application = {};

        textFieldNames.forEach((name) => {
            if (this.state[name]) application[name] = this.state[name];
        });
        numberFieldNames.forEach((name) => {
            if (this.state[name]) application[name] = Number(this.state[name]);
        });
        checkboxFieldNames.forEach((name) => {
            application[name] = {};
            if (this.state[name]) {
                for (var checkProp in this.state[name]) {
                    application[name][checkProp] = this.state[name][checkProp];
                }
            }
        });

        /* Selects are a little more involved because of their 'other' option */
        selectFieldNames.forEach((name) => {
            if (this.state[name] === 'other') application[name] = (this.state[name]) ? this.state[name + 'Text'] : '';
            else if (this.state[name]) application[name] = this.state[name];
        });

        application.submitted = false;

        return application;
    }

    /* Initialize Select form values on page load */
    initSelectState(valuesAndMessages, appValue, name) {
        if (valuesAndMessages.values.find((val) => val === appValue)) this.setState({ [name]: appValue });
        else if (appValue) this.setState({ [name]: 'other', [name+'Text']: appValue });   // Handle 'other' option case
    }

    clearErrorMessages() {
        textFieldNames.forEach((name) => this.setState({ [name + 'Error']: '' }));
        numberFieldNames.forEach((name) => this.setState({ [name + 'Error']: '' }));
        selectFieldNames.forEach((name) => this.setState({ [name + 'Error']: '' }));
        checkboxFieldNames.forEach((name) => this.setState({ [name + 'Error']: '' }));
    }

    getUserField(field) {
        return (this.state.currentUser && this.state.currentUser[field]) || '';
    }


    /************** Rendering **************/
    /*
     * Render a Select with the options defined by options.values and options.messages
     * hooking into the state name and error state error.
     */
    renderSelect(valuesAndMessages, name, error) {
        var options = [];
        for (var i = 0; i < valuesAndMessages.values.length; ++i) {
            options.push(<option key={i} value={valuesAndMessages.values[i]}>{valuesAndMessages.messages[i]}</option>);
        }

        return <SelectInput value={this.state[name]} onChange={this.handleFieldUpdate(name)} error={error} options={options} />;
    }

    /* Render a checkbox with options specified by valuesAndMessages using name and error states */
    renderCheckbox(valuesAndMessages, name) {
        var options = [];

        for (var i = 0; i < valuesAndMessages.values.length; ++i) {
            // Make variables accessible inside onChange
            this.i = i; this.name = name; this.valuesAndMessages = valuesAndMessages;
            options.push(
                <FormControlLabel key={i} label={valuesAndMessages.messages[i]}
                    control={
                        <Checkbox
                            checked={this.state[name][valuesAndMessages.values[i]]}
                            onChange={ this.handleCheckedUpdate(name) }
                            value={valuesAndMessages.values[i]}
                        />
                    }
                />
            );
        }

        return <CheckboxInput options={options} />;
    }

    /* Render a application status update notification */
    renderAppStatusNotification() {
        let title = "Application Status Update";

        if (this.state.loaded && this.state.accepted === undefined) {
            return <AlertBox type="notice" title={title}
                message={ <span>
                    Unfortunately, we are not able to offer you a spot at Equithon at this time, but you have been placed on our waiting list.
                    We received so many awesome applications, but we are only able to accept a limited number of hackers. We will let you know via email if a spot opens up for you!
                </span> }
                />;
        } else if (this.state.loaded && this.state.accepted === false) {
            return(
                <AlertBox type="notice" title={title}
                    message={ <span>
                        Unfortunately, we are not able to offer you a spot for this year’s event.
                        We received so many awesome applications, but we are only able to accept a limited number of hackers.
                        We hope you will apply next year and keep promoting equity in your school, workplace, and community!
                    </span> }
                />
            );
        } else if (this.state.loaded && this.state.accepted === true) {
            return(
                <div style={{ textAlign: 'center' }}>
                    <AlertBox type="notice" title={title}
                        message={ <span>
                            We are happy to invite you to Equithon 2018! 
                            We’re excited about your passion for equity and can’t wait to see what you can make at Equithon.
                            Accept or decline this offer by completing the RSVP form by 11:55 PM on Wednesday, April 11, 2018.
                        </span> }
                    />

                    <Link className="button-link" to="/rsvp">
                        <FlatColoredButton content="Go to RSVP form" />
                    </Link>
                </div>
            );
        }

        return false
    }

    /* Main render entry point */
    render() {
        const { classes } = this.props;

        // Redirect user depending on if they are logged in and if applications have closed
        if (!Meteor.userId() && closed) return <Redirect to="/accounts/login" />;
        else if (!Meteor.userId()) return <Redirect to="/accounts/signup" />;

        return(
            <div id="application-form-wrapper">
                <HomeAppBar />

                {/* Welcome the name of the user */}
                <div style={{gridArea: 'title-row'}}>
                    <Text style={{ textAlign: 'center' }} color="primary" type="display2"
                        text={ 'Welcome' +
                            ((!this.state.loaded) ? '!' :
                                ' ' + this.getUserField('firstName') + ' ' + this.getUserField('lastName') + '!')
                        } />
                </div>

                {/* Display application submission status and any errors that occur */}
                <div style={{ gridArea: 'application-label-row', paddingTop: '30px' }}>
                    <Text align="left" color="primary" type="title"
                        text={ <p>Application > <em>{
                            (!this.state.loaded) ? 'Loading' : (this.state.submitted) ? 'Submitted' : 'Incomplete'
                        }</em></p> } />

                    {/* Informative chips */}
                    <div style={{ display: 'grid', gridRowGap: '10px', padding: '10px', justifyContent: 'center' }}>
                        {/* User not verified */}
                        { (!this.state.verified) ?
                                <ErrorMessageChip errorMessage={unverifiedMessage} /> : false
                        }

                        {/* Submission server error */}
                        { (this.state.errorMessage) ?
                                <ErrorMessageChip errorMessage={this.state.errorMessage} /> : false
                        }

                        {/* Successful operation */}
                        { (this.state.success) ?
                                <SuccessMessageChip successMessage={this.state.successMessage} /> : false
                        }

                        {/* Application status update */}
                        { this.renderAppStatusNotification() }
                    </div>
                </div>

                {/* Actual application */}
                <Paper id="application-form">
                    {/* Personal info form fields */}
                    <div style={{display: 'grid', gridRowGap: '10px', gridTemplateRows: 'auto', gridArea: 'personal-info-row'}}>
                        <Text align="left" color="primary" type="headline" text="Personal Info" />

                        {/* Institution Field */}
                        <Text type="body2" text="What institution do you attend?" />
                        <TextInputField classes={classes} fullWidth value={this.state.institution}
                            onChange={this.handleFieldUpdate('institution')} error={this.state.institutionError} /><br/>

                        {/* Program of Study Field */}
                        <Text type="body2" text="What program of study are you currently enrolled in?" />
                        <TextInputField classes={classes} fullWidth value={this.state.program}
                            onChange={this.handleFieldUpdate('program')} error={this.state.programError} /><br/>

                        {/* Education Level Select Field */}
                        <Text type="body2" text="Which level of education are you currently attending?" />
                        <div style={{ display: 'flex', justifyContent: 'left' }}>
                            { this.renderSelect(valuesAndMessages.eduLevel, 'eduLevel', this.state.eduLevelError) }
                            { (this.state.eduLevel === 'other') ?
                                    <TextInputField
                                        style={{ paddingLeft: '10px', paddingTop: '7px' }}
                                        classes={classes} value={this.state.eduLevelText}
                                        onChange={this.handleFieldUpdate('eduLevelText')} error={this.state.eduLevelError}
                                    /> : false
                            }
                        </div><br/>

                        {/* Graduation Field */}
                        <Text type="body2" text="What year do you graduate?" />
                        <TextInputField classes={classes} type="number" value={this.state.yog}
                            onChange={this.handleFieldUpdate('yog')} error={this.state.yogError} /><br/>

                        {/* City Institution Field */}
                        <Text type="body2" text="Where is your institution located? (City, Country)" />
                        <TextInputField classes={classes} fullWidth value={this.state.cityOfInstitution}
                            onChange={this.handleFieldUpdate('cityOfInstitution')} error={this.state.cityOfInstitutionError} /><br/>

                        {/* Travelling From Field */}
                        <Text type="body2"
                            text="Where would you be travelling from to attend Equithon on May 4-6, 2018? (City, Country)" />
                        <TextInputField classes={classes} fullWidth value={this.state.travellingFrom}
                            onChange={this.handleFieldUpdate('travellingFrom')} error={this.state.travellingFromError} /><br/>

                        {/* Gender Field */}
                        <Text type="body2" text={genderQuestion} />
                        <div style={{ display: 'flex', justifyContent: 'left' }}>
                            { this.renderSelect(valuesAndMessages.gender, 'gender', this.state.genderError) }
                            { (this.state.gender === 'other') ?
                                    <TextInputField
                                        style={{ paddingLeft: '10px', paddingTop: '7px' }}
                                        classes={classes} value={this.state.genderText}
                                        onChange={this.handleFieldUpdate('genderText')} error={this.state.genderError}
                                    /> : false
                            }
                        </div><br/>
                    </div>

                    {/* Activities */}
                    <div style={{display: 'grid', gridRowGap: '10px', gridTemplateRows: 'auto', gridArea: 'activities-row' }}>
                        <Text align="left" color="primary" type="headline" text="Experience and Interests" />

                        {/* Coding Experience Field */}
                        <Text type="body2" text={experienceQuestion} />
                        <div style={{ display: 'flex', justifyContent: 'left' }}>
                            { this.renderSelect(valuesAndMessages.experience, 'experience', this.state.experienceError) }
                            { (this.state.experience === 'other') ?
                                    <TextInputField
                                        style={{ paddingLeft: '10px', paddingTop: '7px' }}
                                        classes={classes} value={this.state.experienceText}
                                        onChange={this.handleFieldUpdate('experienceText')} error={this.state.experienceError}
                                    /> : false
                            }
                        </div><br/>

                        {/* Hackathon Field */}
                        <Text type="body2" text={hackathonQuestion} />
                        <div style={{ display: 'flex', justifyContent: 'left' }}>
                            { this.renderSelect(valuesAndMessages.hackathon, 'hackathon', this.state.hackathonError) }
                        </div><br/>

                        {/* Goals for Eequithon 2018 */}
                        <Text type="body2" text={goalsQuestion} />
                        { this.renderCheckbox(valuesAndMessages.goals, 'goals') }

                        {/* Interested Equithon categories */}
                        <Text type="body2" text={categoriesQuestion} />
                        { this.renderCheckbox(valuesAndMessages.categories, 'categories') }

                        {/* Workshops */}
                        <Text type="body2" text={workshopsQuestion} />
                        { this.renderCheckbox(valuesAndMessages.workshops, 'workshops') }

                        {/* Hear About Us Field */}
                        <Text type="body2" text={hearAboutQuestion} />
                        <div style={{ display: 'flex', justifyContent: 'left' }}>
                            { this.renderSelect(valuesAndMessages.hearAbout, 'hearAbout', this.state.hearAboutError) }
                            { (this.state.hearAbout === 'other') ?
                                    <TextInputField
                                        style={{ paddingLeft: '10px', paddingTop: '7px' }}
                                        classes={classes} value={this.state.hearAboutText}
                                        onChange={this.handleFieldUpdate('hearAboutText')} error={this.state.hearAboutError}
                                    /> : false
                            }
                        </div><br/>
                    </div>

                    <div style={{gridArea: 'long-answer-row'}}>
                        <Text align="left" color="primary" type="headline" text="Long Answer" />

                        <Text type="body2" text={longAnswerQuestion} />
                        <LongInputField classes={classes} value={this.state.longAnswer}
                        onChange={this.handleFieldUpdate('longAnswer')} error={this.state.longAnswerError} />
                    </div>

                    <div style={{ gridArea: 'submit-row' }}>
                        {/* Informative chips */}
                        <div style={{ display: 'grid', gridRowGap: '10px', padding: '10px', justifyContent: 'center' }}>
                            {/* Submission server error */}
                            { (this.state.errorMessage) ?
                                    <ErrorMessageChip errorMessage={this.state.errorMessage} /> : false
                            }

                            {/* Successful operation */}
                            { (this.state.success) ?
                                    <SuccessMessageChip successMessage={this.state.successMessage} /> : false
                            }
                        </div>

                        {/* Do not display save and submit buttons if applications have closed */}
                        { (closed) ? false :
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
                        }
                    </div>
                </Paper>
                <div className="footer"></div>
            </div>
        );
    }
}
export default withStyles(styles)(Apply);

const TextInputField = ({ style, classes, label, type, fullWidth, value, onChange, error }) => (
    <TextField
        style={style}
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

const SelectInput = ({ label, value, onChange, error, options }) => (
    <FormControl error={ !!error }>
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

const CheckboxInput = ({ options }) => (
    <FormControl>
        <FormGroup>
            {options}
        </FormGroup>
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
