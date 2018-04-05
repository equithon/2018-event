import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';


import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/components/buttons/FlatColoredButton.js';
import ConfirmationModal from '/client/ui/components/modals/ConfirmationModal.js';


export default class Rsvp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            travellingFrom: '',

            attending: '',
            confirmTravellingFrom: '',

            confirmationModalOpen: false,
            submitted: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitRSVP = this.submitRSVP.bind(this);
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
            if (rsvp) this.setState({
                attending:             rsvp.attending.toString(),
                confirmTravellingFrom: rsvp.confirmTravellingFrom,
                submitted:             rsvp.submitted,
            });

            console.log(rsvp);
        });
    }

    toBoolean(str) {
        return str === 'true';
    }

    submitRSVP() {
        var rsvp = {
            attending: this.toBoolean(this.state.attending),
            submitted: true,
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
        this.setState({
            [name]: event.target.value
        });
    };

    renderQuestion(name) {
        switch (name) {
            case 'attending':
                return(
                    <BooleanQuestion
                        question="Will you attend Equithon May 4-6?"
                        disabled={this.state.submitted}
                        value={this.state.attending}
                        onChange={ this.handleChange('attending') }
                    />
                );
            case 'confirmTravellingFrom':
                return(
                    <BooleanQuestion
                        question={
                            'You indicated you travelling from ' + this.state.travellingFrom + '. Is this correct?'
                        }
                        disabled={this.state.submitted}
                        value={this.state.confirmTravellingFrom}
                        onChange={ this.handleChange('confirmTravellingFrom') }
                    />
                );
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
                        { (this.state.attending === 'true') ? this.renderQuestion('confirmTravellingFrom') : false }

                        <FlatColoredButton
                            disabled={ this.state.submitted }
                            onClick={ () => this.setState({ confirmationModalOpen: true }) }
                            content="Submit"
                        />
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

const BooleanQuestion = ({ question, disabled, value, onChange }) => (
    <div className="split-column-row">
        <Text style={{ gridArea: 'left' }} align="left" color="primary" type="headline"
            text={question} />
        <FormControl style={{ gridArea: 'right' }} component="fieldset" required>
            <RadioGroup
                aria-label="answer"
                value={value}
                onChange={onChange}
                row
            >
                <FormControlLabel value="true" disabled={disabled} control={<Radio />} label="Yes" />
                <FormControlLabel value="false" disabled={disabled} control={<Radio />} label="No" />
            </RadioGroup>
        </FormControl>
    </div>
);

const SelectInput = ({ value, onChange, error, options }) => (
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
