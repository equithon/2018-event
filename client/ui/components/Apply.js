import React, { Component } from 'react';
import {Button, TextField} from "material-ui";
import Text from "./Text";
import Schema from "../../../common/Schema"
import SimpleSchema from 'simpl-schema';

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

    render() {
        return(
            <div id="application-form">
                <div style={{gridArea: 'title-row'}}>
                    <Text style={{ textAlign: 'center' }} color="primary" type="display1" text="Apply for Equithon 2018" />
                </div>
                <div style={{gridArea: 'personal-info-row'}}>
                    <TextField name="fullName" onChange={this.handleFieldUpdate.bind(this)} placeholder="Jane Doe" label="Full Name"/><br/><br/>
                    <TextField name="university" onChange={this.handleFieldUpdate.bind(this)} placeholder="University of Waterloo" label="Your University"/><br/><br/>
                    <TextField name="yog" onChange={this.handleFieldUpdate.bind(this)} defaultValue="2017" label="Year of Graduation" type="number"/><br/><br/>
                </div>
                <div style={{gridArea: 'long-answer-row'}}>
                    <TextField name="project" onChange={this.handleFieldUpdate.bind(this)} multiline={true} rows="10" fullWidth={true} label="Tell us about a project that you think is cool that you've worked on in the last year"/><br/><br/>
                </div>
                <div style={{gridArea: 'submit-row'}}>
                    <Button raised color="primary" onClick={this.submitApplication.bind(this)}>
                        Submit Application
                    </Button>
                </div>
            </div>
        );
    }
}


