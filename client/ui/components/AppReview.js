import React, { Component } from 'react';

import { Tracker } from 'meteor/tracker';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import Text from '/client/ui/components/Text.js';
import { valuesAndMessages, experienceQuestion, hackathonQuestion, goalsQuestion, categoriesQuestion,
    hearAboutQuestion, workshopsQuestion, longAnswerQuestion } from '/client/ui/components/Apply.js';
import ErrorMessageChip from '/client/ui/components/notif-chips/ErrorMessageChip.js';
import SuccessMessageChip from '/client/ui/components/notif-chips/SuccessMessageChip.js';
import FlatColoredButton from '/client/ui/components/buttons/FlatColoredButton.js';
import ConfirmationModal from '/client/ui/components/modals/ConfirmationModal.js';

/*
 * Application review component
 */
export default class AppReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            success: false,
            submitDisabled: false,
            errorMessage: '',
            confirmationModalOpen: false,

            app: {},

            // Ratings
            goalsRating: 0,
            categoriesRating: 0,
            specificIssue: 0,
            whyImportant: 0,
            passion: 0,

            // Verifications
            local: false,
            grad: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNext   = this.handleNext.bind(this);
    }

    /*
     * Component reactivity
     */
    componentDidMount() {
        this.handleNext()
    }

    /*
     * Event Handling
     */
    handleSubmit() {
        var rating = {
            appId: this.state.app._id,

            // Ratings
            goalsRating: Number(this.state.goalsRating),
            categoriesRating: Number(this.state.categoriesRating),
            specificIssue: Number(this.state.specificIssue),
            whyImportant: Number(this.state.whyImportant),
            passion: Number(this.state.passion),

            // Verifications
            local: this.state.local,
            grad: this.state.grad,
        };

        Meteor.call('applications.submitRating', rating, (err, res) => {
            if (err) {
                this.setState({
                    success: false,
                    submitDisabled: false,
                    message: err.reason,
                });
            } else {
                this.setState({
                    success: true,
                    submitDisabled: true,
                    message: 'Ratings successfully submitted',
                });
            }
        });
    }

    handleNext() {
        Meteor.call('applications.getNextAppForReview', (err, res) => {
            this.setState({ success: false });
            if (err) {
                this.setState({
                    app: {},
                    submitDisabled: false,
                    message: err.reason,
                });
            } else if (res) {
                var prevId = (this.state.app && this.state.app._id);

                this.setState({
                    app: res,
                    submitDisabled: false,
                    message: '',

                });
            } else {
                this.setState({
                    app: {},
                    submitDisabled: true,
                    message: 'There are no more applications to review',
                });
            }

            // Reset review fields if the application we are displaying has changed
            if (!res || prevId !== res._id) {
                this.setState({
                    // Ratings
                    goalsRating: 0,
                    categoriesRating: 0,
                    specificIssue: 0,
                    whyImportant: 0,
                    passion: 0,

                    // Verifications
                    local: false,
                    grad: false,
                });
            }
        });

    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };


    /*
     * Useful helpers for retrieving the correct messages represented by the app values.
     */
    getAnswerForValue(name) {
        if (!name) return '';

        var i = valuesAndMessages[name].values.indexOf(this.state.app[name]);
        var answer = valuesAndMessages[name].messages[i];

        return (answer) ? answer : this.state.app[name];    // To handle custom user-inputted text.
    }

    getAnswersForValue(name) {
        if (!name) return '';

        var appAnswers = this.state.app[name];
        var answers = [];

        for (var key in appAnswers) {
            if (appAnswers.hasOwnProperty(key) && appAnswers[key]) {
                var i = valuesAndMessages[name].values.indexOf(key);
                var answer = valuesAndMessages[name].messages[i];
                answers.push(<li key={i}>{answer}</li>);
            }
        }

        return (answers.length > 0) ? <span>{answers}</span> : 'No answers selected';
    }


    renderAppForReview() {
        return(
            <Paper id="app-review" style={{ textAlign: 'left' }}>
                {/* Header */}
                <Header gridName="qa-header" left="Question" right="Answer" />

                <div style={{ gridArea: "qa-body" }}>
                    {/* Graduation Date */}
                    <AppQA question="Year of Graduation (should be greater than or equal to 2018):" answer={ this.state.app.yog } />

                    {/* Location */}
                    <AppQA question="Where are you travelling from?" answer={ this.state.app.travellingFrom } />

                    {/* Experience Level */}
                    <AppQA question={experienceQuestion} answer={ this.getAnswerForValue('experience') } />

                    {/* Hackathon Experience */}
                    <AppQA question={hackathonQuestion} answer={ this.getAnswerForValue('hackathon') } />

                    {/* Hear About */}
                    <AppQA question={hearAboutQuestion} answer={ this.getAnswerForValue('hearAbout') } />

                    {/* Goals */}
                    <AppQA question={goalsQuestion} answer={ this.getAnswersForValue('goals') } />

                    {/* Categories of Interest */}
                    <AppQA question={categoriesQuestion} answer={ this.getAnswersForValue('categories') } />

                    {/* Workshops of Interest */}
                    <AppQA question={workshopsQuestion} answer={ this.getAnswersForValue('workshops') } />

                    {/* Long Answer */}
                    <div style={{ paddingTop: '10px' }}>
                        <Text type="body1" text={<strong>{longAnswerQuestion}</strong>} /><br/>
                        <Text type="body1" text={this.state.app.longAnswer} />
                    </div>
                </div>

                {/* Ratings */}
                <Text style={{ gridArea: 'ratings-header' }} color="primary" type="headline" text="Ratings" />
                <div style={{ gridArea: 'ratings-body' }}>
                    <Text color="primary" type="subheading"
                        text={ <a href="https://docs.google.com/document/d/1HU4dUOhbEezH64oPvRjaYigrj47tSMoyVsAqGbfyW1c/edit?pli=1">Rubric</a> } />
                    <Text color="primary" type="subheading" text="Selection Ratings" />
                    {/* Goals Rating */}
                    <Rating criteria="Goals [0,1]:" type="number" value={this.state.goalsRating}
                        onChange={ this.handleChange('goalsRating') } />
                    {/* Categories Rating */}
                    <Rating criteria="Categories [0,1]:" type="number" value={this.state.categoriesRating}
                        onChange={ this.handleChange('categoriesRating') } />

                    {/* Long Answer Ratings - See application rubric for more details */}
                    <Text color="primary" type="subheading" text="Long Answer Ratings" />
                    <Rating criteria="Specific Issue [0,2]:" type="number" value={this.state.specificIssue}
                        onChange={ this.handleChange('specificIssue') } />
                    <Rating criteria="Why is this important [0,3]:" type="number" value={this.state.whyImportant}
                        onChange={ this.handleChange('whyImportant') } />
                    <Rating criteria="Perceived passion [0,3]:" type="number" value={this.state.passion}
                        onChange={ this.handleChange('passion') } />

                    <Text color="primary" type="subheading" text="Manual Verifications" />
                    {/* Manual Verifications */}
                    {/* Local? */}
                    <Verification criteria="Is this application from Waterloo?" value={this.state.local}
                        onChange={ ((event) => this.setState({ local: event.target.checked })).bind(this) } />

                    {/* Student? */}
                    <Verification criteria="Is this application's graduation date 2018 or later?" value={this.state.grad}
                        onChange={ ((event) => this.setState({ grad: event.target.checked })).bind(this) } />
                </div>

                {/* Submission Button */}
                <div className="split-column-row" style={{ gridArea: 'submit', textAlign: 'center', width: '100%' }}>
                    <div style={{ gridArea: 'left' }}>
                        <FlatColoredButton onClick={this.handleNext} content="Next Application" />
                    </div>
                    <div style={{ gridArea: 'right' }}>
                        <FlatColoredButton
                            disabled={this.state.submitDisabled}
                            onClick={ (() => this.setState({ confirmationModalOpen: true })).bind(this) }
                            content="Submit" />

                        <ConfirmationModal
                            open={this.state.confirmationModalOpen}
                            onClose={ (() => this.setState({ confirmationModalOpen: false })).bind(this) }
                            onYes={this.handleSubmit}
                            message="Are you sure?"
                        />
                    </div>
                </div>

                {/* Message Footer */}
                <div style={{ gridArea: 'footer' }}>
                    { (this.state.success) ?
                            <SuccessMessageChip successMessage={this.state.message} /> :
                            <ErrorMessageChip errorMessage={this.state.message} />
                    }
                </div>
            </Paper>
        );
    }

    render() {
        return(
            <div>
                { (this.state.app === undefined) ? false : this.renderAppForReview() }
            </div>
        );
    }
}

const Header = ({ gridName, left, right }) => (
    <div className="split-column-row" style={{ gridArea: gridName }}>
        <Text style={{ gridArea: 'left' }} color="primary" type="headline" text={left} />
        <Text style={{ gridArea: 'right' }} color="primary" type="headline" text={right} />
    </div>
);

const AppQA = ({ question, answer }) => (
    <div className="split-column-row" style={{ gridColumnGap: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
        <Text style={{ gridArea: 'left' }} type="body1" text={<strong>{question}</strong>} />
        <Text style={{ gridArea: 'right' }} type="body1" text={answer} />
    </div>
);

const Rating = ({ criteria, onChange, value }) => (
    <div>
        <Text style={{ gridArea: 'left' }} type="body1" text={criteria} />
        <TextField
            style={{ width: '50px', paddingBottom: '10px' }}
            type="number"
            onChange={onChange}
            value={value}
        />
    </div>
);

const Verification = ({ criteria, onChange, value }) => (
    <div>
        <Text style={{ gridArea: 'left' }} type="body1" text={criteria} />
        <Checkbox style={{ gridArea: 'right' }}
            checked={value}
            onChange={onChange}
        />
    </div>
);
