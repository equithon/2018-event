import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/buttons/FlatColoredButton.js';
import ForgotPasswordModal from '/client/ui/components/ForgotPasswordModal.js';


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',

            success: false,
            errorMessage: '',

            // Forgot Password Modal
            forgotPasswordModalOpen: false,
        };

        this.handleUserLogin                = this.handleUserLogin.bind(this);
        this.handleChange                   = this.handleChange.bind(this);
        this.handleForgotPasswordModalOpen  = this.handleForgotPasswordModalOpen.bind(this);
        this.handleForgotPasswordModalClose = this.handleForgotPasswordModalClose.bind(this);
    }

    /***** Event Handling *****/
    /* User Login */
    handleUserLogin(event) {
        event.preventDefault();

        Meteor.loginWithPassword({ email: this.state.email }, this.state.password, (err) => {
            if (err) this.setState({
                errorMessage: err.reason,
            });
            else this.setState({
                success: true,
                errorMessage: '',
            });
        });
    }

    /* Open ForgotPasswordModal */
    handleForgotPasswordModalOpen(event) {
        event.preventDefault();

        this.setState({
            forgotPasswordModalOpen: true,
        });
    }

    /* Close ForgotPasswordModal */
    handleForgotPasswordModalClose(event) {
        event.preventDefault();

        this.setState({
            forgotPasswordModalOpen: false,
        });
    }

    /* Change in any of the text fields */
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    /*
     * Main login form that handles actual logins.
     */
    render() {
        const { classes } = this.props;

        return(
            <div className="accounts-grid">
                <div style={{ gridArea: 'body', textAlign: 'center' }}>
                    {/* Logo */}
                    <img className="accounts-logo" src="/logos/logo-bulb_256x256.png" />

                    {/* Words */}
                    <Text className="accounts-login-title" style={{ color: 'white' }} align="center" type="display3"
                        text="Welcome Back!" />
                    <Text className="accounts-login-desc" style={{ color: 'white' }} align="center" type="display1"
                        text="Let's get to work." />

                    {/* Form */}
                    <form onSubmit={this.handleUserLogin}>
                        {/* Email Field */}
                        <TextField
                            style={{ align: 'center' }}
                            InputProps={{ classes: {
                                root: classes.textFieldRoot,
                                input: classes.textFieldInput,
                            }}}
                            InputLabelProps={{ className: classes.textFieldFormLabel }}
                            fullWidth
                            margin="normal"

                            label="Email"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                            required
                        />

                        {/* Password Field */}
                        <TextField
                            style={{ align: 'center' }}
                            InputProps={{ classes: {
                                root: classes.textFieldRoot,
                                input: classes.textFieldInput,
                            }}}
                            InputLabelProps={{ className: classes.textFieldFormLabel }}
                            fullWidth
                            margin="normal"

                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            required
                        />

                        {/* Forgot Password Optional Button */}
                        <div className="accounts-align-right" style={{ padding: '5px' }}>
                            <Button
                                classes={{
                                    root: classes.optionButtonRoot,
                                    label: classes.optionButtonLabel,
                                }}
                                onClick={this.handleForgotPasswordModalOpen}
                            >
                                <strong><em>I forgot my password</em></strong>
                            </Button>
                        </div>

                        {/* Login Main Button */}
                        <div style={{ textAlign: 'center', padding: '5px' }}>
                            <FlatColoredButton
                                classes={{
                                    root: classes.buttonRoot,
                                    label: classes.buttonLabel,
                                }}
                                onClick={this.handleUserLogin} content="Login"
                            />
                        </div>

                        {/* Home Main Button */}
                        <div style={{ textAlign: 'center', padding: '5px' }}>
                            <Link to="/">
                                <Button
                                    classes={{
                                        root: classes.buttonRoot,
                                        label: classes.buttonLabel
                                    }}
                                >
                                    HOME
                                </Button>
                            </Link>
                        </div>
                    </form>

                    {/* Conditionally render error message */}
                    { (this.state.success) ?
                            <Redirect to="/" /> :
                            this.renderErrorMessage()
                    }

                    {/* Forgot password modal */}
                    <ForgotPasswordModal open={this.state.forgotPasswordModalOpen} onClose={this.handleForgotPasswordModalClose} />

                </div>

                {/* Footer */}
                <AccountsLoginFooter classes={classes} />
            </div>
        );
    }

    /*
     * Error message displayed as a chip in the bottom left.
     */
    renderErrorMessage() {
        const { classes } = this.props;

        let errorMessage = this.state.errorMessage;
        if (!errorMessage) return false;

        return(
            <Chip
                classes={{
                    root: classes.chipRoot,
                    label: classes.chipLabel,
                }}
                avatar={
                    <Avatar
                        className={ classes.chipAvatarRoot }
                        children={ <i className="fas fa-exclamation"></i> }
                    ></Avatar>
                }
                label={ <Text style={{ color: 'white' }} type="body2" text={ errorMessage} />}
            />
        );
    }
}


/*
 * Footer for Login Accounts page.
 */
const AccountsLoginFooter = ({ classes }) => (
    <div style={{ gridArea: 'footer' }}>
        <Text style={{ paddingTop: '30px', color: 'white' }} align="center" type="subheading"
            text={
                <div>New User? <Link to="/accounts/signup">
                    <Button classes={{ root: classes.optionButtonRoot, label: classes.optionButtonLabel }}>
                        <strong>CREATE AN ACCOUNT</strong>
                    </Button>
                </Link></div>
            }
        />
    </div>
);
