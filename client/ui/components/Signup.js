import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import ReCaptcha from 'react-recaptcha';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import checkAppCloseDate from '/imports/api/AppCloseDate.js';

import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/components/buttons/FlatColoredButton.js';
import { AccountsFooter, AppClosedMessage } from '/client/ui/components/Accounts.js';
import ErrorMessageChip from '/client/ui/components/notif-chips/ErrorMessageChip.js';

const signupStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '500px',
    padding: '10px',
    paddingTop: '110px',
};

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
            captchaToken: '',

            success: false,
            errorMessage: '',

            siteKey: '',
        };

        /* Make sure we have the captcha site key */
        Meteor.call('captcha.getSiteKey', function(err, res) {
            if (res !== undefined) this.setState({ siteKey: res });
        }.bind(this));

        this.recaptchaInstance; // Store a ref to the recaptcha so we can explicitly reset it.

        this.handleSignup = this.handleSignup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCaptcha = this.handleCaptcha.bind(this);
    }

    /***** Event Handling *****/
    /* User Signup */
    handleSignup(event) {
        event.preventDefault();

        if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                success: false,
                errorMessage: "Your confirmation password does not match your actual password"
            });
        } else if (this.state.email !== this.state.confirmEmail) {
            this.setState({
                success: false,
                errorMessage: "Your confirmation email does not match your actual email"
            });
        } else if (this.state.email === '') {
            this.setState({
                success: false,
                errorMessage: "Please enter an email account"
            });
        } else if (this.state.password === '') {
            this.setState({
                success: false,
                errorMessage: "Please enter a password"
            });
        } else {
            let user = {};
            if (this.state.firstName) user.firstName      = this.state.firstName;
            if (this.state.lastName) user.lastName        = this.state.lastName;
            if (this.state.email) user.email              = this.state.email;
            if (this.state.password) user.password        = this.state.password;
            if (this.state.captchaToken) user.captchaToken = this.state.captchaToken;

            Accounts.createUser(user, (error, result) => {
                if (error) {
                    this.setState({
                        success: false,
                        errorMessage: error.reason,
                    });
                    this.recaptchaInstance.reset();  // Explicitly reset captcha so user doesn't need to manually.
                } else {
                    this.setState({
                        success: true,
                        errorMessage: '',
                    });
                }
            });
        }
    }

    /* Change in any of the text fields */
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };



    handleCaptcha(responseToken) {
        this.setState({
            captchaToken: responseToken,
        });
    };

    /***** Rendering *****/
    /*
     * Main signup form
     */
    render() {
        const { classes } = this.props;

        // Make sure applications haven't closed
        try {
            checkAppCloseDate();
        } catch (e) {
            return <AppClosedMessage classes={classes} error={e} />;
        }

        return(
            <div className="accounts-grid">
                <div style={{ gridArea: 'body', textAlign: 'center' }}>
                    {/* Logo */}
                    <img className="accounts-logo" src="/logos/logo-bulb_256x256.png" />

                    {/* Words */}
                    <Text style={{ color: 'white' }} align="center" type="display3"
                        text="Create an Account" />

                    {/* Form */}
                    <form onSubmit={this.handleUserLogin}>
                        {/* First Name Field */}
                        <TextInputField classes={classes} label="First Name" value={this.state.firstName}
                            onChange={this.handleChange} stateName="firstName" />

                        {/* Last Name Field */}
                        <TextInputField classes={classes} label="Last Name" value={this.state.lastName}
                            onChange={this.handleChange} stateName="lastName" />

                        {/* Email Field */}
                        <TextInputField classes={classes} label="Email" value={this.state.email}
                            onChange={this.handleChange} stateName="email" />

                        {/* Confirm Email Field */}
                        <TextInputField classes={classes} label="Confirm Email" value={this.state.confirmEmail}
                            onChange={this.handleChange} stateName="confirmEmail" />

                        {/* Password Field */}
                        <PasswordInputField classes={classes} label="Password" value={this.state.password}
                            onChange={this.handleChange} stateName="password" />

                        {/* Confirm Password Field */}
                        <PasswordInputField classes={classes} label="Confirm Password" value={this.state.confirmPassword}
                            onChange={this.handleChange} stateName="confirmPassword" />

                        {/* Signup Main Button */}
                        <div style={{ textAlign: 'center', padding: '5px' }}>
                            <FlatColoredButton classes={{ root: classes.buttonRoot }}
                                onClick={this.handleSignup} content="Signup"
                            />
                        </div>

                        {/* Conditionally render error message */}
                        { (this.state.success) ?
                                <Redirect to="/accounts/verify-email" /> :
                                <ErrorMessageChip errorMessage={this.state.errorMessage} />
                        }

                        {/* Google recaptcha */}
                        { (this.state.siteKey) ?
                            <div className="recaptcha-div">
                                <ReCaptcha
                                    style={{height: '175px'}}
                                    ref={ e => this.recaptchaInstance = e }
                                    sitekey={this.state.siteKey}
                                    render="explicit"
                                    verifyCallback={this.handleCaptcha}
                                    size="compact"
                                />
                            </div> : false
                        }

                        {/* Home Main Button */}
                        <div style={{ textAlign: 'center', padding: '5px' }}>
                            <Link className="button-link" to="/">
                                <Button classes={{ root: classes.buttonRoot }}>
                                    HOME
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <AccountsFooter classes={classes} link="/accounts/login" text="Already have an account?" buttonText="SIGN IN" />
            </div>
        );
    }
}


const PasswordInputField = ({ classes, label, value, onChange, stateName }) => (
    <TextField
        style={{ align: 'center' }}
        InputProps={{ classes: {
            root: classes.textFieldRoot,
            input: classes.textFieldInput,
        }}}
        InputLabelProps={{ className: classes.textFieldFormLabel }}
        fullWidth
        margin="normal"

        type="password"
        autoComplete="current-password"
        label={label}
        value={value}
        onChange={onChange(stateName)}
        required
    />
);

const TextInputField = ({ classes, label, value, onChange, stateName }) => (
    <TextField
        style={{ align: 'center' }}
        InputProps={{ classes: {
            root: classes.textFieldRoot,
            input: classes.textFieldInput,
        }}}
        InputLabelProps={{ className: classes.textFieldFormLabel }}
        fullWidth
        margin="normal"

        label={label}
        value={value}
        onChange={onChange(stateName)}
        required
    />
);
