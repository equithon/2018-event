import React, { Component } from 'react';

import { Tracker } from 'meteor/tracker';

import { Link, Route } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/components/buttons/FlatColoredButton.js';
import ErrorMessageChip from '/client/ui/components/notif-chips/ErrorMessageChip.js';
import SuccessMessageChip from '/client/ui/components/notif-chips/SuccessMessageChip.js';


/*
 * User search component.
 * Allows team members to search for users by name or email and view/change certain properties.
 */
export default class UserSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',

            selectedUser: null,
            selectedRSVP: null,

            errorMessage: '',
        };

        this.searchC = null;

        this.handleChange = this.handleChange.bind(this);
        this.viewUser = this.viewUser.bind(this);
        this.checkIn = this.checkIn.bind(this);
    }

    componentDidMount() {
        this.searchC = Tracker.autorun(() => {
            Meteor.subscribe('userData');
        });
    }

    componentWillUnmount() {
        this.searchC.stop();
    }


    /*
     * Event Handling
     */
    // Handle changes to state from form
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    // Retrieve user and rsvp belonging to ID and update state accordingly
    viewUser = event => {
        var id = event.currentTarget.attributes.userid.value;

        // Update user state and mark RSVP as loading until we get the result from the method
        var user = Meteor.users.findOne({ _id: id });
        this.setState({ selectedUser: user, selectedRSVP: 'loading' });

        // Update rsvp state
        if (user) Meteor.call('rsvps.getByUser', { userId: id }, (err, res) => {
            if (err) {
                this.setState({
                    selectedRSVP: null,
                    errorMessage: err.reason,
                });
            } else {
                this.setState({
                    selectedRSVP: res,
                    errorMessage: '',
                });
            }
        });
    }

    // Check the selected user in via Meteor method
    checkIn() {
        if (!this.state.selectedUser) return;

        // Check in and update the selected user state to match changes
        Meteor.call('user.checkIn', { userId: this.state.selectedUser._id }, (err, res) => {
            if (err) this.setState({ errorMessage: err.reason });
            else this.setState({
                errorMessage: '',
                selectedUser: Meteor.users.findOne({ _id: this.state.selectedUser._id }),
            });
        });
    }


    /*
     * Rendering
     */
    // Render search results reactively according to given form fields
    renderSearchResults() {
        var search = {};
        if (this.state.firstName)search.firstName = { '$regex': '^' + this.state.firstName, '$options': 'i' };
        if (this.state.lastName) search.lastName = { '$regex': '^' + this.state.lastName, '$options': 'i' };
        if (this.state.email) search.emails = { '$elemMatch': { address: { '$regex': '^' + this.state.email }, verified: true } };

        // Get results, limited to 10 users
        // Search pagination is a little too much work for this
        var results;
        var error = false;  // For displaying error on invalid search
        try {
            results = Meteor.users.find(search, { limit: 10 });

            // Create table rows for each result
            var rows = [];
            if (results) {
                var k = 0;
                results.forEach((result) => {
                    rows.push(
                        <tr key={k} userid={result._id} onClick={this.viewUser}>
                            <th><Text color="inherit" type="body1"
                                    text={result.firstName} /></th>

                            <th><Text color="inherit" type="body1"
                                text={result.lastName} /></th>

                            <th><Text color="inherit" type="body1"
                                text={result.emails[0].address} /></th>
                        </tr>
                    );
                    ++k;
                });
            }
        } catch (e) {
            error = true;   // Display an error on invalid search
        }

        return (
            (error) ?
                <div style={{ textAlign: 'center' }}>
                    <ErrorMessageChip errorMessage="Invalid search" />
                </div> :

                <table className="list">
                    <thead>
                        <tr>
                            <th><Text color="primary" type="body1" text="First Name" /></th>
                            <th><Text color="primary" type="body1" text="Last Name" /></th>
                            <th><Text color="primary" type="body1" text="Email" /></th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows}
                    </tbody>
                </table>
        );
    }

    // Render the currently selected user from the search.
    renderSelectedUser() {
        var user = this.state.selectedUser;

        if (!this.state.selectedUser) return false;

        return(
            <div style={{ width: '100%' }}>
                <Text style={{ textAlign: 'center' }} color="primary" type="display2"
                    text={user.firstName + " " + user.lastName} />

                <div className="split-column-row" style={{ padding: '10px' }}>
                    <Text style={{ gridArea: 'left' }} color="primary" type="title"
                        text="RSVP form" />

                    {/* User check in button */}
                    <div style={{ gridArea: 'right', textAlign: 'right' }}>
                        <FlatColoredButton
                            disabled={ (this.state.selectedUser && this.state.selectedUser.checkedIn) }
                            onClick={this.checkIn}
                            content={ (this.state.selectedUser && this.state.selectedUser.checkedIn) ?
                                        <span><i className="fas fa-check"></i>{"Checked In"}</span> :
                                        "Check in"
                            }
                        />
                    </div>
                </div>

                { this.renderRSVP() }
            </div>
        );
    }

    // Render the selected user's RSVP form in the form of a question answer table
    renderRSVP() {
        var rsvp = this.state.selectedRSVP;
        if (rsvp === 'loading') {
            return(
                <div style={{ textAlign: 'center' }}>
                    <Text color="primary" type="title" text="Loading..." />
                </div>
            );
        } else if (!rsvp) return(
            <div style={{ textAlign: 'center' }}>
                <Text color="primary" type="title" text="This user does not have an RSVP form." />
            </div>
        );

        // Data
        var data= []; var k = 0;
        for (var prop in rsvp) {
            if (prop === '_id' || prop === 'userId') continue;

            var propCell = <th><Text color="inherit" type="body1" text={<strong>{prop}</strong>} /></th>;
            var valueCell = false;

            // Push prop-value row into the table
            if (typeof rsvp[prop] !== 'object') {    // Primitive values
                valueCell = <th><Text color="inherit" type="body1"
                    text={(typeof rsvp[prop] === 'boolean') ?  rsvp[prop].toString() : rsvp[prop] }
                /></th>;
            } else if (typeof rsvp[prop] === 'object') {    // Handle non-primitve answers separately
                // Null object
                if (rsvp[prop] === null) {
                    valueCell = <th><Text color="inherit" type="body1" text="null" /></th>;
                } else {  // Create a list of answers
                    var values = [];

                    var i = 0;  // Insert values
                    for (var valName in rsvp[prop]) {
                        values.push(
                            <Text key={i} color="inherit" type="body1" text={valName + ": " + rsvp[prop][valName]} />
                        );
                        ++i;
                    }

                    valueCell = <th>{values}</th>;
                }
            }

            // Push new prop-value row into data to go into the body of the table
            data.push(<tr key={k}>
                {propCell}
                {valueCell}
            </tr>);

            ++k;
        }

        return(
            <table className="list">
                <thead>
                    <tr>
                        <th><Text color="primary" type="body1" text="Question" /></th>
                        <th><Text color="primary" type="body1" text="Answer" /></th>
                    </tr>
                </thead>

                <tbody>
                    {data}
                </tbody>
            </table>
        );
    }

    render() {
        return(
            <Paper className="form-paper" style={{ textAlign: 'left' }}>
                {/* Title */}
                <Text style={{ textAlign: 'center' }} color="primary" type="display2"
                    text="User Search" />

                <br/>

                {/* Search inputs */}
                <SearchInput
                    text="First Name:"
                    onChange={ this.handleChange('firstName') }
                    value={this.state.firstName}
                />

                <SearchInput
                    text="Last Name:"
                    onChange={ this.handleChange('lastName') }
                    value={this.state.lastName}
                />

                <SearchInput
                    text="Email:"
                    onChange={ this.handleChange('email') }
                    value={this.state.email}
                />

                {/* Search Results */}
                <br/>
                <Text style={{ textAlign: 'center' }} color="primary" type="display2"
                    text="Search Results" />
                <br/>
                { this.renderSearchResults() }

                { (!this.state.errorMessage) ? false :
                        <ErrorMessageChip errorMessage={this.state.errorMessage} />
                }

                {/* Selected User */}
                <br/>
                { this.renderSelectedUser() }
            </Paper>
        );
    }
}

const SearchInput = ({ text, onChange, value }) => (
    <div className="split-column-row">
        <Text style={{ textAlign: 'left', gridArea: 'left' }} type="body1" text={text} />
        <TextField style={{ paddingBottom: '10px' }}
            onChange={onChange}
            value={value}
        />
    </div>
);
