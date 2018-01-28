import React, { Component } from 'react';
import {Button, TextField} from "material-ui";
import Text from "./Text";

export default class Apply extends Component {
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
    }

    handleFieldUpdate(event, newValue) {
        event.persist();
        this.setState((state) => state[event.target.name] = newValue);
    }

    render() {
        return(
            <div id="application-form">
                <div style={{gridArea: 'title-row'}}>
                    <Text style={{ textAlign: 'center' }} color="primary" type="display1" text="Apply for Equithon 2018" />
                </div>
                <div style={{gridArea: 'personal-info-row'}}>
                    <TextField name="fullName" onChange={this.handleFieldUpdate} placeholder="Jane Doe" label="Full Name"/><br/><br/>
                    <TextField name="university" onChange={this.handleFieldUpdate} placeholder="University of Waterloo" label="Your University"/><br/><br/>
                    <TextField name="yog" onChange={this.handleFieldUpdate} defaultValue="2017" label="Year of Graduation" type="number"/><br/><br/>
                </div>
                <div style={{gridArea: 'long-answer-row'}}>
                    <TextField name="fullName" onChange={this.handleFieldUpdate} multiline={true} rows="10" fullWidth={true} label="Tell us about a project that you think is cool that you've worked on in the last year"/><br/><br/>
                </div>
                <div style={{gridArea: 'submit-row'}}>
                    <Button raised color="primary" onClick={this.submitApplication()}>
                        Submit Application
                    </Button>
                </div>
            </div>
        );
    }
}


