import React, { Component } from 'react';

import { Tracker } from 'meteor/tracker';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

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

            success: false,
            message: '',
        };

        this.searchC = null;

        this.handleChange = this.handleChange.bind(this);
    }

    /*
     * Subscribe to userSearch
     */
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
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };


    /*
     * Rendering
     */
    renderSearchResults() {
        console.log(this.state);

        var search = {};
        if (this.state.firstName) search.firstName = this.state.firstName;
        if (this.state.lastName) search.lastName = this.state.lastName;
        if (this.state.email) search.emails = { address: this.state.email, verified: true };

        console.log(search);

        var searchResult = Meteor.users.find(search, { limit: 10 }).fetch();

        var rows = [];
        if (searchResult) {
            for (var i = 0; i < searchResult.length; ++i) {
                rows.push(
                    <tr key={i} style={{ width: '100%' }}>
                        <th><Text color="inherit" type="body1"
                            text={searchResult[i].firstName} /></th>
                        <th><Text color="inherit" type="body1"
                            text={searchResult[i].lastName} /></th>
                        <th><Text color="inherit" type="body1"
                            text={searchResult[i].emails[0].address} /></th>
                    </tr>
                );
            }
        }

        console.log(rows);

        return(
            <table style={{ width: '100%' }}>
                <thead>
                    <tr style={{ width: '100%' }}>
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

                {/* Success/failure notification */}
                <div style={{ gridArea: 'left' }}>
                    { (this.state.success) ?
                            <SuccessMessageChip successMessage={this.state.message} /> :
                            <ErrorMessageChip errorMessage={this.state.message} />
                    }
                </div>

                { this.renderSearchResults() }
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
