import React, { Component } from 'react';

import { Redirect } from 'react-router';

import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormGroup, FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/components/buttons/FlatColoredButton.js';
import ConfirmationModal from '/client/ui/components/modals/ConfirmationModal.js';
import FileUpload from '/client/ui/components/FileUpload.js';
import SuccessMessageChip from '/client/ui/components/notif-chips/SuccessMessageChip.js';
import ErrorMessageChip from '/client/ui/components/notif-chips/ErrorMessageChip.js';


/* Common definitions */
const textFieldNames = [ 'confirmTravellingFrom', 'roommateRequestName', 'roommateRequestEmail',
    'roommateGender', 'dietText', 'shirtSize' ];
const checkboxFieldNames = [ 'diet' ];
const booleanFieldNames = [ 'attending', 'needBus', 'requireAccomodation', 'roommateRequest', 'roommatePreference', 'age' ];
const confirmTravellingFromOptions = [ 'grt', 'toronto', 'montreal', 'other' ];

const waiverLink = 'https://drive.google.com/file/d/1h8b3B6lBXEdppI8cAju8ykrhiIa5VFrO/view';

/*
 * RSVP form complete with waiver and resume file uploads.
 */
export default class Rsvp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            attending: '',
            confirmTravellingFrom: '',
            confirmTravellingFromText: '',
            needBus: '',
            requireAccomodation: '',
            roommateRequest: '',
            roommateRequestName: '',
            roommateRequestEmail: '',
            roommateGender: '',
            roommatePreference: '',
            age: '',
            diet: { vegetarian: false, vegan: false, gluten: false, halal: false, other: false },
            dietText: '',
            shirtSize: '',
            waiver: false,
            resume: false,

            success: false,
            errorMessage: '',
            confirmationModalOpen: false,
            submitted: false,
            accepted: undefined,
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitRSVP = this.submitRSVP.bind(this);
        this.renderQuestion = this.renderQuestion.bind(this);
    }

    componentDidMount() {
        this.appC = Tracker.autorun(() => {
            Meteor.subscribe('applicationData');

            let app = Applications.findOne({});
            if (app) this.setState({
                accepted: app.accepted,
                loaded: true
            });
        });

        this.rsvpC = Tracker.autorun(() => {
            Meteor.subscribe('rsvpData');

            let rsvp = Rsvps.findOne({});
            if (rsvp) {
                textFieldNames.forEach((name) => this.setState({ [name]: (rsvp[name]) ? rsvp[name] : '' }));
                booleanFieldNames.forEach((name) => this.setState({ [name]: (rsvp[name] != null) ? rsvp[name].toString() : '' }));
                checkboxFieldNames.forEach((name) => {
                    for (var checkProp in rsvp[name]) {
                        this.setState({ [name]: { ...this.state[name], [checkProp]: rsvp[name][checkProp] }});
                    }
                });

                if (confirmTravellingFromOptions.find((val) => val === rsvp.confirmTravellingFrom)) {
                    this.setState({ confirmTravellingFrom: rsvp.confirmTravellingFrom });
                } else if (rsvp.confirmTravellingFrom) {
                    this.setState({ confirmTravellingFrom: 'other', confirmTravellingFromText: rsvp.confirmTravellingFrom });
                }

                this.setState({
                    waiver: rsvp.waiver,
                    resume: rsvp.resume,
                    submitted: rsvp.submitted
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.appC) this.appC.stop();
        if (this.rsvpC) this.rsvpC.stop();
    }

    toBoolean(str) {
        return str === 'true';
    }

    submitRSVP() {
        var rsvp = {
            attending:             this.toBoolean(this.state.attending),
            confirmTravellingFrom: (this.state.confirmTravellingFrom) ? this.state.confirmTravellingFrom : 'grt',
            needBus:               this.toBoolean(this.state.needBus),
            requireAccomodation:   this.toBoolean(this.state.requireAccomodation),
            roommateRequest:       this.toBoolean(this.state.roommateRequest),
            roommateRequestName:   (this.state.roommateRequestName) ? this.state.roommateRequestName : undefined,
            roommateRequestEmail:  (this.state.roommateRequestEmail) ? this.state.roommateRequestEmail : undefined,
            roommateGender:        (this.state.roommateGender) ? this.state.roommateGender : undefined,
            roommatePreference:    this.toBoolean(this.state.roommatePreference),
            age:                   this.toBoolean(this.state.age),
            diet:                  this.state.diet,
            dietText:              (this.state.diet.other) ? this.state.dietText : undefined,
            shirtSize:             (this.state.shirtSize) ? this.state.shirtSize : 's',
            waiver:                this.state.waiver,
            resume:                this.state.resume,
        };

        // confirmTravellingFrom special case
        if (this.state.confirmTravellingFrom === 'other') {
            rsvp.confirmTravellingFrom = (this.state.confirmTravellingFromText) ? this.state.confirmTravellingFromText : '';
        }

        Meteor.call('rsvps.submit', rsvp, (err, res) => {
            if (err) {
                this.setState({ success: false });
                if (err.details) {  // Display the first validation error to the user
                    this.setState({ errorMessage: err.details[0].message });
                } else {
                    this.setState({ errorMessage: err.reason });
                }
            } else {
                this.setState({
                    success: true,
                    errorMessage: ''
                });
            }
        });
    };

    handleChange = name => event => {
        if (!this.state.submitted) {
            this.setState({
                [name]: event.target.value
            });
        }
    };

    handleChecked = name => (event, checked) => {
        if (!this.state.submitted) {
            this.setState({
                [name]: {
                    ...this.state[name], [event.target.value]: checked
                }
            });
        }
    };

    renderCheckbox(values, messages, name, question) {
        var checkboxes = [];

        for (var i = 0; i < values.length; ++i) {
            // Make variables accessible inside onChange
            this.i = i; this.name = name; this.values = values; this.messages = messages;
            checkboxes.push(
                <FormControlLabel key={i} label={messages[i]}
                    control={
                        <Checkbox
                            checked={this.state[name][values[i]]}
                            onChange={ this.handleChecked(name) }
                            value={values[i]}
                        />
                    }
                />
            );
        }

        return <CheckboxInput question={question} checkboxes={checkboxes} />;
    }

    renderQuestion(name) {
        switch (name) {
            case 'attending':
                return(
                    <span>
                        <Text align="left" color="primary" type="headline" style={{ paddingBottom: '10px' }} text="Attendance" />
                        <BooleanQuestion
                            question="Will you attend Equithon May 4-6?"
                            value={this.state.attending}
                            onChange={ this.handleChange('attending') }
                        />
                    </span>
                );

            case 'confirmTravellingFrom':
                if (this.state.attending === 'true') {
                    var options = [];
                    options.push(<option key={0} value="grt">I will be travelling from within Kitchener-Waterloo</option>);
                    options.push(<option key={1} value="toronto">I will be travelling from Toronto or the GTA (not including the cities below)</option>);
                    options.push(<option key={2} value="mississauga">I will be travelling from Mississauga, Brampton, Oakville, or Milton</option>);
                    options.push(<option key={3} value="other">I will be travelling from another location</option>);
                    return(
                        <span>
                            <Text align="left" color="primary" type="headline" style={{ paddingBottom: '10px' }} text="Travel" />
                            <SelectInput
                                question="Where will you be travelling from?"
                                value={this.state.confirmTravellingFrom}
                                onChange={ this.handleChange('confirmTravellingFrom') }
                                options={options}
                            />

                            { (this.state.confirmTravellingFrom === 'other') ?
                                    <TextInput
                                        question="Please enter where you will be travelling from (City, Country)."
                                        value={this.state.confirmTravellingFromText}
                                        onChange={ this.handleChange('confirmTravellingFromText') }
                                    /> : false
                            }

                            { this.renderQuestion('needBus') }
                            { this.renderQuestion('requireAccomodation') }
                            { this.renderQuestion('age') }
                        </span>
                    );
                } else return false;

            case 'needBus':
                if (this.state.confirmTravellingFrom === 'mississauga') {
                    return(
                        <BooleanQuestion
                            question="A bus from Square One will be provided for free. Would you like to reserve a spot on this bus?"
                            value={this.state.needBus}
                            onChange={ this.handleChange('needBus') }
                        />
                    );
                } else if (this.state.confirmTravellingFrom === 'toronto') {
                    return(
                        <BooleanQuestion
                            question="A bus from the University of Toronto (St. George Campus) will be provided for free. Would you like to reserve a spot on this bus?"
                            value={this.state.needBus}
                            onChange={ this.handleChange('needBus') }
                        />
                    );
                } else return false;

            case 'requireAccomodation':
                if (this.state.attending === 'true' && this.state.confirmTravellingFrom !== 'grt' && this.state.confirmTravellingFrom !== '') {
                    return(
                        <span>
                            <BooleanQuestion
                                question="Will you require overnight accommodation?"
                                value={this.state.requireAccomodation}
                                onChange={ this.handleChange('requireAccomodation') }
                            />

                            { this.renderQuestion('roommateRequest') }
                        </span>
                    );
                } else return false;

            case 'roommateRequest':
                if (this.state.requireAccomodation === 'true') {
                    return(
                        <span>
                            <BooleanQuestion
                                question="Do you wish to request a specific accepted hacker to be your roommate? The person must respond with your name to confirm the request."
                                value={this.state.roommateRequest}
                                onChange={ this.handleChange('roommateRequest') }
                            />

                            { this.renderQuestion('roommatePreference') }
                            { this.renderQuestion('roommateRequestInfo') }
                        </span>
                    );
                } else return false;

            case 'roommatePreference':
                if (this.state.roommateRequest === 'false') {
                    var options = [];
                    options.push(<option key={0} value="m">Male</option>);
                    options.push(<option key={1} value="f">Female</option>);
                    options.push(<option key={2} value="other">Other</option>);

                    return(
                        <span>
                            <Text align="left" color="inherit" type="body2" style={{ paddingBottom: '10px' }}
                                text="You will be assigned a roommate. There will be specific male, female, and gender-neutral rooms. Please fill out the following:" />

                            <SelectInput
                                question="Your gender:"
                                value={this.state.roommateGender}
                                onChange={ this.handleChange('roommateGender') }
                                options={options}
                            />
                            <BooleanQuestion
                                question="Would you like to be assigned a roommate of the same gender?"
                                value={this.state.roommatePreference}
                                onChange={ this.handleChange('roommatePreference') }
                            />
                        </span>
                    );
                } else return false;

            case 'roommateRequestInfo':
                if (this.state.roommateRequest === 'true') {
                    return(
                        <span>
                            <TextInput
                                question="Please enter your desired roommate's full name."
                                value={this.state.roommateRequestName}
                                onChange={ this.handleChange('roommateRequestName') }
                            />
                            <TextInput
                                question="Please enter your desired roommate's email address they used to create their equithon.org account."
                                value={this.state.roommateRequestEmail}
                                onChange={ this.handleChange('roommateRequestEmail') }
                            />
                        </span>
                    );
                } else return false;

            case 'age':
                if (this.state.requireAccomodation === 'false' || this.state.confirmTravellingFrom === 'grt' ||
                    this.state.confirmTravellingFrom === '' || this.state.roommateRequest) {
                    return(
                        <span>
                            <Text align="left" color="primary" type="headline" style={{ paddingBottom: '10px' }} text="Age" />
                            <BooleanQuestion
                                question="Will you be at least 18 years old on May 4, 2018?"
                                value={this.state.age}
                                onChange={ this.handleChange('age') }
                            />

                            { (this.state.age === 'false') ?
                                <span>
                                    <Text align="left" color="primary" type="body2" style={{ paddingBottom: '10px' }}
                                        text="Waiver" />
                                    <Text align="left" color="inherit" type="subheading" style={{ paddingBottom: '10px' }}
                                        text={ <span>Please upload a copy of <a target="_blank" href={waiverLink}>this consent form</a> signed by your parent or guardian.</span> } />

                                    { (this.state.submitted) ? (this.state.waiver) ?
                                            <Text type="body2" color="textSecondary" style={{ paddingBottom: '10px' }}
                                                text="Successfully submitted waiver." /> :
                                            <Text type="body2" color="textSecondary" style={{ paddingBottom: '10px' }}
                                                text="No waiver submitted." /> :

                                            <FileUpload what="waiver" disabled={this.state.submitted}
                                                onSuccess={ (() => this.setState({ waiver: true })).bind(this) }
                                                onFailure={ (() => this.setState({ waiver: false })).bind(this) }
                                            />
                                    }
                                    <br/>
                                </span> : false
                            }

                            { this.renderQuestion('foodswag') }
                        </span>
                    );
                } else return false;

            case 'foodswag':
                if (this.state.age === 'true' || (this.state.age === 'false' && this.state.waiver)) {
                    var dietValues = ['vegetarian', 'vegan', 'gluten', 'halal', 'other'];
                    var dietMessages = ['Vegetarian', 'Vegan', 'Gluten free', 'Halal', 'Other'];
                    var shirtOptions = [];
                    shirtOptions.push(<option key={0} value="s">S</option>);
                    shirtOptions.push(<option key={1} value="m">M</option>);
                    shirtOptions.push(<option key={2} value="l">L</option>);
                    shirtOptions.push(<option key={3} value="xl">XL</option>);

                    return(
                        <span>
                            <Text align="left" color="primary" type="headline" style={{ paddingBottom: '10px' }} text="Logistics" />
                            { this.renderCheckbox(dietValues, dietMessages, 'diet', 'Do you have any dietary restrictions?') }
                            { (this.state.diet.other) ?
                                    <span>
                                        <TextField
                                            style={{ paddingBottom: '10px' }}
                                            value={this.state.dietText}
                                            onChange={ this.handleChange('dietText') }
                                        /><br/>
                                    </span> : false
                            }

                            <SelectInput
                                question="What is your t-shirt size?"
                                value={this.state.shirtSize}
                                onChange={ this.handleChange('shirtSize') }
                                options={shirtOptions}
                            />
                        </span>
                    );
                } else return false;

            case 'resume':
                return(
                    <span>
                        <Text align="left" color="primary" type="headline" style={{ paddingBottom: '10px' }} text="Resume" />
                        <Text align="left" color="inherit" type="subheading" style={{ paddingBottom: '10px' }}
                            text="Equithon has a variety of sponsors that are looking to hire students! You may upload your resume to opt-in for this opportunity. By uploading your resume, you give Equithon permission to share your uploaded file with its sponsors." />
                        { (this.state.submitted) ? (this.state.resume) ?
                                <Text type="body2" color="textSecondary" style={{ paddingBottom: '10px' }}
                                    text="Successfully submitted resume." /> :
                                <Text type="body2" color="textSecondary" style={{ paddingBottom: '10px' }}
                                    text="No resume submitted." /> :

                                <FileUpload what="resume" disabled={this.state.submitted}
                                    onSuccess={ (() => this.setState({ resume: true })).bind(this) }
                                    onFailure={ (() => this.setState({ resume: false })).bind(this) }
                                />
                        }
                        <br/>
                    </span>
                );

            default:
                console.log('Can\'t render ' + name);
        }
        return false;
    }

    render() {
        if (!Meteor.userId()) return <Redirect to="/accounts/login" />;
        else if (this.state.loaded && !this.state.accepted) return <Redirect to="/apply" />;
        else if (!this.state.loaded) return false;

        return(
            <div style={{ paddingTop: '110px' }}>
                <HomeAppBar noAppButton />

                <div className="form-wrapper">
                    <div style={{ gridArea: 'title-row' }}>
                        <Text align="center" color="primary" type="display2" text="RSVP Form" />
                        <Text align="center" color="textSecondary" style={{ paddingTop: '20px'}} type="subheading" text={ <span>
                            Congratulations on being accepted to Equithon 2018!<br/>
                            Please submit this RSVP form by 11:55PM on Wednesday, April 11 to secure your spot.
                            </span> } />
                    </div>

                    <Paper className="form-paper">
                        {/* Attending */}
                        { this.renderQuestion('attending') }

                        {/* Rest of form */}
                        { this.renderQuestion('confirmTravellingFrom') }

                        {/* Resume upload */}
                        { (this.state.attending === 'true' && this.state.age === 'true' ||
                            (this.state.age === 'false' && this.state.waiver)) ?
                                this.renderQuestion('resume') : false
                        }

                        {/* Submit */}
                        { (this.state.attending === 'false' || this.state.age === 'true' ||
                            (this.state.age === 'false' && this.state.waiver)) ?
                                <div className="split-column-row">
                                    <div style={{ gridArea: 'left' }}>
                                        <FlatColoredButton
                                            disabled={ this.state.submitted }
                                            onClick={ () => this.setState({ confirmationModalOpen: true }) }
                                            content="Submit"
                                        />
                                    </div>
                                    <div style={{ gridArea: 'right', textAlign: 'center' }}>
                                        { (this.state.errorMessage) ?
                                            <ErrorMessageChip errorMessage={this.state.errorMessage} /> : false
                                        }
                                        { (this.state.success) ?
                                            <SuccessMessageChip successMessage="Your RSVP form was successfully submitted" /> : false
                                        }
                                    </div>
                                </div> : false
                        }

                        <ConfirmationModal
                            open={this.state.confirmationModalOpen}
                            onClose={ () => this.setState({ confirmationModalOpen: false }) }
                            onYes={this.submitRSVP}
                            message="Are you sure you would like to submit your RSVP? You cannot edit after submitting."
                        />
                    </Paper>
                </div>
            </div>
        );
    }
}


const BooleanQuestion = ({ question, value, onChange }) => (
    <div className="split-column-row" style={{ gridRowGap: '10px', gridColumnGap: '10px', paddingBottom: '10px' }}>
        <Text style={{ gridArea: 'left' }} align="left" color="inherit" type="body2" text={question} />
        <FormControl style={{ gridArea: 'right' }} component="fieldset" required>
            <RadioGroup
                aria-label="answer"
                value={value}
                onChange={onChange}
                row
            >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
        </FormControl>
    </div>
);

const CheckboxInput = ({ question, checkboxes }) => (
    <div>
        <Text align="left" color="inherit" type="body2" text={question} />
        <FormControl required>
            <FormGroup>
                {checkboxes}
            </FormGroup>
        </FormControl>
    </div>
);

const SelectInput = ({ question, value, onChange, error, options }) => (
    <div className="split-column-row" style={{ paddingBottom: '10px' }}>
        <Text style={{ gridArea: 'left' }} align="left" color="inherit" type="body2" text={question} />
        <span style={{ gridArea: 'right' }}>
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
        </span>
    </div>
);

const TextInput = ({ question, value, onChange }) => (
    <div className="split-column-row" style={{ paddingBottom: '10px' }}>
        <Text style={{ gridArea: 'left' }} align="left" color="inherit" type="body2" text={question} />
        <TextField value={value} onChange={onChange} />
    </div>
);
