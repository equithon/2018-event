import React, { Component } from 'react';

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


const textFieldNames = [ 'confirmTravellingFrom', 'roommateRequestName', 'roommateRequestEmail',
    'roommateGender', 'roommatePreference', 'dietText' ];
const checkboxFieldNames = [ 'diet' ];
const booleanFieldNames = [ 'attending', 'needBus', 'requireAccomodation', 'roommateRequest', 'age' ];

export default class Rsvp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            travellingFrom: '',

            attending: '',
            confirmTravellingFrom: '',
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

            confirmationModalOpen: false,
            submitted: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitRSVP = this.submitRSVP.bind(this);
        this.renderQuestion = this.renderQuestion.bind(this);
    }

    componentDidMount() {
        this.appC = Tracker.autorun(() => {
            Meteor.subscribe('applicationData');

            let app = Applications.findOne();
            if (app) this.setState({
                travellingFrom: app.travellingFrom
            });
        });

        this.rsvpC = Tracker.autorun(() => {
            Meteor.subscribe('rsvpData');

            let rsvp = Rsvps.findOne();
            if (rsvp) {
                textFieldNames.forEach((name) => this.setState({ [name]: (rsvp[name]) ? rsvp[name] : '' }));
                booleanFieldNames.forEach((name) => this.setState({ [name]: (rsvp[name] != null) ? rsvp[name].toString() : '' }));
                checkboxFieldNames.forEach((name) => {
                    for (var checkProp in rsvp[name]) {
                        this.setState({ [name]: { ...this.state[name], [checkProp]: rsvp[name][checkProp] }});
                    }
                });

                this.setState({ submitted: rsvp.submitted });
            }
        });
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
            roommatePreference:    (this.state.roommatePreference) ? this.state.roommatePreference : undefined,
            age:                   this.toBoolean(this.state.age),
            diet:                  this.state.diet,
            shirtSize:             (this.state.shirtSize) ? this.state.shirtSize : 's',
            submitted:             true,
        };

        Meteor.call('rsvps.submit', rsvp, (err, res) => {
            console.log(err);
            if (err) {
                this.setState({
                    submitted: false
                });
            } else {
                this.setState({
                    submitted: true
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
                        <Text align="left" color="primary" type="display1" style={{ paddingBottom: '10px' }} text="Attendance" />
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
                    options.push(<option key={0} value="grt">I will be travelling from within GRT</option>);
                    options.push(<option key={1} value="toronto">I will be travelling from Toronto</option>);
                    options.push(<option key={2} value="mississauga">I will be travelling from Mississauga</option>);
                    options.push(<option key={3} value="other">I will be travelling from another location</option>);
                    return(
                        <span>
                            <Text align="left" color="primary" type="display1" style={{ paddingBottom: '10px' }} text="Travel" />
                            <SelectInput
                                question="Where will you be travelling from May 4-6?"
                                value={this.state.confirmTravellingFrom}
                                onChange={ this.handleChange('confirmTravellingFrom') }
                                options={options}
                            />

                            { this.renderQuestion('needBus') }
                            { this.renderQuestion('requireAccomodation') }
                        </span>
                    );
                } else return false;

            case 'needBus':
                if (this.state.confirmTravellingFrom === 'mississauga') {
                    return(
                        <BooleanQuestion
                            question="A bus from McGill University will be provided for free. Would you like to reserve a spot on this bus?"
                            value={this.state.needBus}
                            onChange={ this.handleChange('needBus') }
                        />
                    );
                } else if (this.state.confirmTravellingFrom === 'toronto') {
                    return(
                        <BooleanQuestion
                            question="A bus from the University of Toronto will be provided for free. Would you like to reserve a spot on this bus?"
                            value={this.state.needBus}
                            onChange={ this.handleChange('needBus') }
                        />
                    );
                } else return false;

            case 'requireAccomodation':
                if (this.state.attending === 'true') {
                    return(
                        <span>
                            <BooleanQuestion
                                question="Will you require living accomodation?"
                                value={this.state.requireAccomodation}
                                onChange={ this.handleChange('requireAccomodation') }
                            />

                            { this.renderQuestion('roommateRequest') }
                            { this.renderQuestion('age') }
                        </span>
                    );
                } else return false;

            case 'roommateRequest':
                if (this.state.requireAccomodation === 'true') {
                    return(
                        <span>
                            <BooleanQuestion
                                question="Do you wish to request a specific persion for your roommate?"
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
                    options.push(<option key={2} value="nb">Non-Binary</option>);
                    options.push(<option key={3} value="other">Other</option>);

                    return(
                        <span>
                            <Text align="left" color="primary" type="headline" style={{ paddingBottom: '10px' }}
                                text="You will be assigned a roommate. There will be specific male, female, and gender-neutral rooms. Please fill out the following" />

                            <SelectInput
                                question="Your gender:"
                                value={this.state.roommateGender}
                                onChange={ this.handleChange('roommateGender') }
                                options={options}
                            />
                            <SelectInput
                                question="Gender you would like to room with:"
                                value={this.state.roommatePreference}
                                onChange={ this.handleChange('roommatePreference') }
                                options={options}
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
                                question="Please enter your desired roommate's email address."
                                value={this.state.roommateRequestEmail}
                                onChange={ this.handleChange('roommateRequestEmail') }
                            />
                        </span>
                    );
                } else return false;

            case 'age':
                if (this.state.requireAccomodation === 'false' || this.state.roommateRequest) {
                    return(
                        <span>
                            <Text align="left" color="primary" type="headline" style={{ paddingBottom: '10px' }} text="Age" />
                            <BooleanQuestion
                                question="Will you be at least 18 years old on May 4, 2018?"
                                value={this.state.age}
                                onChange={ this.handleChange('age') }
                            />

                            { this.renderQuestion('foodswag') }
                        </span>
                    );
                } else return false;

            case 'foodswag':
                if (this.state.age === 'true' || (this.state.age === 'false' && this.state.waiver)) {
                    var dietValues = ['vegetarian', 'vegan', 'gluten', 'halal', 'other'];
                    var dietMessages = ['Vegetarian', 'Vegan', 'Gluten', 'Halal', 'Other'];
                    var shirtOptions = [];
                    shirtOptions.push(<option key={0} value="s">S</option>);
                    shirtOptions.push(<option key={1} value="m">M</option>);
                    shirtOptions.push(<option key={2} value="l">L</option>);
                    shirtOptions.push(<option key={3} value="xl">XL</option>);

                    return(
                        <span>
                            <Text align="left" color="primary" type="headline" style={{ paddingBottom: '10px' }} text="Food/Swag" />
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

            default:
                console.log('Can\'t render ' + name);
        }
        return false;
    }

    render() {
        return(
            <div style={{ paddingTop: '110px' }}>
                <HomeAppBar />

                <div className="form-wrapper">
                    <div style={{ gridArea: 'title-row' }}>
                        <Text align="center" color="primary" type="display2" text="RSVP Form" />
                        <Text align="center" color="textSecondary" type="subheading" text="Congratulations on being accepted to Equithon 2018! Please fill out this RSVP form to secure your spot" />
                    </div>

                    <Paper className="form-paper">
                        {/* Attending */}
                        { this.renderQuestion('attending') }

                        {/* Travel Section */}
                        { this.renderQuestion('confirmTravellingFrom') }

                        { (this.state.attending === 'false' || this.state.age === 'true' ||
                            (this.state.age === 'false' && this.state.waiver)) ?
                                <span>
                                    <FlatColoredButton
                                        disabled={ this.state.submitted }
                                        onClick={ () => this.setState({ confirmationModalOpen: true }) }
                                        content="Submit"
                                    />
                                </span> : false
                        }
                        <ConfirmationModal
                            open={this.state.confirmationModalOpen}
                            onClose={ () => this.setState({ confirmationModalOpen: false }) }
                            onYes={this.submitRSVP}
                            message="Are you sure you would like to submit your application? You cannot edit after submitting."
                        />
                    </Paper>
                </div>
            </div>
        );
    }
}

const BooleanQuestion = ({ question, value, onChange }) => (
    <div className="split-column-row" style={{ paddingBottom: '10px' }}>
        <Text style={{ gridArea: 'left' }} align="left" color="inherit" type="headline" text={question} />
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
        <Text align="left" color="inherit" type="headline" text={question} />
        <FormControl required>
            <FormGroup>
                {checkboxes}
            </FormGroup>
        </FormControl>
    </div>
);

const SelectInput = ({ question, value, onChange, error, options }) => (
    <div className="split-column-row" style={{ paddingBottom: '10px' }}>
        <Text style={{ gridArea: 'left' }} align="left" color="inherit" type="headline" text={question} />
        <FormControl style={{ gridArea: 'right' }} error={ !!error }>
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
    </div>
);

const TextInput = ({ question, value, onChange }) => (
    <div className="split-column-row" style={{ paddingBottom: '10px' }}>
        <Text style={{ gridArea: 'left' }} align="left" color="inherit" type="headline" text={question} />
        <TextField value={value} onChange={onChange} />
    </div>
);
