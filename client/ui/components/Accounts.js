import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/components/buttons/FlatColoredButton.js';
import ForgotPasswordModal from '/client/ui/components/modals/ForgotPasswordModal.js';
import Login from '/client/ui/components/Login.js';
import Signup from '/client/ui/components/Signup.js';
import VerifyEmail, { VerifyEmailWithToken } from '/client/ui/components/VerifyEmail.js';
import ResetPassword from '/client/ui/components/ResetPassword.js';


/* Styles for various components */
const styles = theme => ({
    /* TextField */
    textFieldFormLabel: {
        color: theme.palette.common.white,
    },
    textFieldInput: {
        padding: '10px 12px',
        color: theme.palette.common.white,
    },

    /* Main Button */
    buttonRoot: {
        color: theme.palette.common.white,
        borderRadius: '25px',
        height: '50px',
        width: '50%',
    },

    /* Option Button */
    optionButtonRoot: {
        color: theme.palette.common.white,
        borderRadius: '25px',
        width: 'auto',
        textTransform: 'capitalize',
    },

});

class Accounts extends Component {
    constructor(props) {
        super(props);
    }


    /***** Rendering *****/
    /* Rendering entry point */
    render() {
        const { classes } = this.props;

        let token = "actualtoken";

        return(
            <div className="accounts-background">               {/* Cool background image */}
                <div className="accounts-background-color">     {/* Purple gradient overlay */}
                    {/* Body */}
                    {/* Login */}
                    <Route path="/accounts/login" render={() => <Login classes={classes} />} />

                    {/* Signup */}
                    <Route path="/accounts/signup" render={() => <Signup classes={classes} />} />

                    {/* Verify Email */}
                    <Route exact path="/accounts/verify-email" render={() => <VerifyEmail classes={classes} />} />
                    <Route path="/accounts/verify-email/:token"
                        render={(prop) => <VerifyEmailWithToken classes={classes} match={prop.match} />} />

                    {/* Reset Password */}
                    <Route path="/accounts/reset-password/:token"
                        render={(prop) => <ResetPassword classes={classes} match={prop.match} />} />

                    {/* Go back to home page on logout */}
                    <Route path="/accounts/logout" render={() => {
                      Meteor.logout();
                      return <Redirect to="/" />;
                    }} />
                </div>
            </div>
        );
    }
}
export default withStyles(styles)(Accounts);


/*
 * Footer for Signup page.
 */
export const AccountsFooter = ({ classes, link, text, buttonText }) => (
    <div style={{ gridArea: 'footer' }}>
        <Text style={{ paddingTop: '30px', color: 'white' }} align="center" type="subheading"
            text={
                <div>{text} <Link className="button-link" to={link}>
                    <Button classes={{ root: classes.optionButtonRoot, label: classes.optionButtonLabel }}>
                        <strong>{buttonText}</strong>
                    </Button>
                </Link></div>
            }
        />
    </div>
);

/*
 * Empty footer for spacing
 */
export const EmptyAccountsFooter = () => (
    <div style={{ gridArea: 'footer', padding: '30px' }}></div>
);

/*
 * Applications closed error message.
 */
export const AppClosedMessage = ({ classes, error }) => (
    <div className="accounts-grid">
        <div style={{ gridArea: 'body', textAlign: 'center' }}>
            {/* Logo */}
            <img className="accounts-logo" src="/logos/logo-bulb_256x256.png" />

            {/* Applications closed message */}
            <Text style={{ color: 'white' }} align="center" type="display2"
                text="Unfortunately applications have closed. We hope you try again next year!" /><br/>
            <Text style={{ color: 'white' }} align="center" type="headline"
                text={error.error} />
        </div>

        <AccountsFooter classes={classes} link="/" text="" buttonText="HOME" />
    </div>
);

/* Maybe useful? */
const StaffOption = ({ classes }) => (
    <div style={{ textAlign: 'right' }}>
        <Route exact path="/login" render={() => (
            <Link className="button-link" to="/login/staff" replace>
                <Button classes={{ root: classes.optionButtonRoot, label: classes.optionButtonLabel, }}>
                    <strong><em>Staff Login</em></strong>
                </Button>
            </Link>
        )} />
        <Route exact path="/login/staff" render={() => (
            <Link className="button-link" to="/login" replace>
                <Button classes={{ root: classes.optionButtonRoot, label: classes.optionButtonLabel, }}>
                    <strong><em>User Login</em></strong>
                </Button>
            </Link>
        )} />
    </div>
);
