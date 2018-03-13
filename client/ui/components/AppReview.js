import React, { Component } from 'react';

import { Tracker } from 'meteor/tracker';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

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
            passion: 0,
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
            passion: Number(this.state.passion),
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
            if (err) {
                this.setState({
                    app: {},
                    success: false,
                    submitDisabled: false,
                    message: err.reason,
                });
            } else if (res) {
                this.setState({
                    app: res,
                    success: false,
                    submitDisabled: false,
                    message: '',
                });
            } else {
                this.setState({
                    app: {},
                    success: false,
                    submitDisabled: true,
                    message: 'There are no more applications to review',
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

                {/* Experience Level */}
                <AppQA gridName="experience" question={experienceQuestion}
                    answer={ this.getAnswerForValue('experience') } />

                {/* Hackathon Experience */}
                <AppQA gridName="hackathon" question={hackathonQuestion}
                    answer={ this.getAnswerForValue('hackathon') } />

                {/* Hear About */}
                <AppQA gridName="hearAbout" question={hearAboutQuestion}
                    answer={ this.getAnswerForValue('hearAbout') } />

                {/* Goals */}
                <AppQA gridName="goals" question={goalsQuestion}
                    answer={ this.getAnswersForValue('goals') } />

                {/* Categories of Interest */}
                <AppQA gridName="categories" question={categoriesQuestion}
                    answer={ this.getAnswersForValue('categories') } />

                {/* Workshops of Interest */}
                <AppQA gridName="workshops" question={workshopsQuestion}
                    answer={ this.getAnswersForValue('workshops') } />

                {/* Long Answer */}
                <div style={{ gridArea: 'longAnswer' }}>
                    <Text type="body1" text={<strong>{longAnswerQuestion}</strong>} /><br/>
                    <Text type="body1" text={this.state.app.longAnswer} />
                </div>

                {/* Ratings Header */}
                <Header gridName="ratings-header" left="Criteria" right="Rating" />

                {/* Passion Rating */}
                <Rating gridName="passion-rating" criteria="Passion:" type="number" value={this.state.passion}
                    onChange={this.handleChange('passion')} />

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

const AppQA = ({ gridName, question, answer }) => (
    <div className="split-column-row" style={{ gridArea: gridName, gridColumnGap: '20px' }}>
        <Text style={{ gridArea: 'left' }} type="body1" text={<strong>{question}</strong>} />
        <Text style={{ gridArea: 'right' }} type="body1"
            text={answer} />
    </div>
);

const Rating = ({ gridName, criteria, onChange, value }) => (
    <div className="split-column-row" style={{ gridArea: gridName }}>
        <Text style={{ gridArea: 'left' }} type="body1" text={criteria} />
        <TextField
            style={{ width: '50px' }}
            type="number"
            onChange={onChange}
            value={value}
        />
    </div>
);
