import React, { Component } from 'react';

import { Tracker } from 'meteor/tracker';

import { Route, Link, Redirect } from 'react-router-dom';

import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import FlatColoredButton from '/client/ui/components/buttons/FlatColoredButton.js';
import AppReview from '/client/ui/components/AppReview.js';

/*
 * Team Home Page
 */
export default class TeamHome extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        window.scroll(0, 0);    // Scroll up when loading new page

        this.userC = Tracker.autorun(() => {
            let user = Meteor.user();
            this.setState({
                currentUser: user,
            });
        });
    }

    componentWillUnmount() {
        this.userC.stop();
    }

    renderTeamHome() {
        return(
            <div id="team-home" style={{ textAlign: 'center' }}>
                <HomeAppBar />

                <div style={{ gridArea: 'selection' }}>
                    <AppButtons />
                </div>

                <div style={{ gridArea: 'body' }}>
                    <Route path="/team/app-review" component={AppReview} />
                    <Route path="/team/app-statistics" render={() => <h1> APP STATISTICS</h1>} />
                </div>
            </div>
        );
    }

    render() {
        // Send to home if not logged in
        if (!Meteor.userId()) return <Redirect to="/" />;

        // Give them nothing if they are not a team member
        return (
            <div>
                { (!this.state.currentUser || !this.state.currentUser.isTeam) ? false : this.renderTeamHome() }
            </div>
        );
    }
}

const AppButtons = () => (
    <div className="split-column-row">
        <div style={{ gridArea: 'left' }}>
            <Link className="button-link" to="/team/app-review">
                <FlatColoredButton content="Review an Application" />
            </Link>
        </div>

        <div style={{ gridArea: 'right' }}>
            <Link className="button-link" to="/team/app-statistics">
                <FlatColoredButton content="View Application Statistics" />
            </Link>
        </div>
    </div>
);
