import React, { Component } from 'react';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

import Paper from 'material-ui/Paper';

import Text from '/client/ui/components/Text.js';


/*
 * Hooking into the email verification system is a bit cumbersome.
 * I followed this:
 * https://github.com/meteor/meteor/blob/ef64f7ac27b071e544c22e1df0e5db636eb967a1/packages/accounts-ui-unstyled/login_buttons_dialogs.js
 */

/*
 * Register email verification callback.
 */
Accounts.onEmailVerificationLink((token, done) => {
    Accounts.verifyEmail(token, (err) => {
        if (err) {
            Session.set('emailVerificationFailed', true);
        } else {
            Session.set('justVerifiedEmail', true);
        }

        done();
    });
});


/*
 * Email verification UI informing user of successful email verification.
 */
export default class EmailVerification extends Component {
    constructor(props) {
        super(props);

        /*
         * Computation variable to hold the Tracker's computation object
         * regarding rendering this component.
         */
        this.renderComputation = undefined;

        this.state = {
            renderSuccess: false,
            renderFailure: false,
        };
    }

    componentWillMount() {
        this.renderComputation = Tracker.autorun(() => {
            if (Session.get('justVerifiedEmail')) {
                this.setState({
                    renderSuccess: true,
                    renderFailure: false,
                });
            } else if (Session.get('emailVerificationFailed')) {
                this.setState({
                    renderSuccess: false,
                    renderFailure: true,
                });
            }
        });
    }

    componentWillUnmount() {
        this.renderComputation.stop();
    }

    render() {
        /* Reactively render this component */
        if (this.state.renderSuccess) return <VerifiedEmail />;
        else if (this.state.renderFailure) return <UnverifiedEmail />;

        /* Cleanup */
        Session.set({
            justVerifiedEmail: false,
            emailVerificationFailed: false,
        });
        return false;
    }
}


const centerScreenStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '500px',
    padding: '10px',
    paddingTop: '110px',
};

const VerifiedEmail = () => (
    <div style={centerScreenStyle}>
        <Paper style={{ padding: '50px' }}>
            <Text style={{ textAlign: 'center' }} color="primary" type="display1" text="Email Verification Succeeded!" />
            <Text color="secondary" type="body2" text={
                <div>
                    Your email has been verified! Click <a href="/">here</a> to view your account.
                </div>
            }/>
        </Paper>
    </div>
);

const UnverifiedEmail = () => (
    <div style={centerScreenStyle}>
        <Paper style={{ padding: '50px' }}>
            <Text style={{ textAlign: 'center' }} color="error" type="display1" text="Email Verification Failed!" />
            <Text color="primary" type="body2"
                text="Unfortunately email verification failed. Please ensure you are using the correct link sent to you in by email."
            />
        </Paper>
    </div>
);
