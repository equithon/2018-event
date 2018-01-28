import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/buttons/FlatColoredButton.js';


/* Styles for various components */
const styles = theme => ({
    /* TextField */
    textFieldFormLabel: {
        //fontSize: 18,
        color: theme.palette.common.white,
    },
    textFieldInput: {
        //fontSize: 20,
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
    buttonLabel: {
        //fontSize: 16,
    },

    /* Option Button */
    optionButtonRoot: {
        color: theme.palette.common.white,
        borderRadius: '25px',
        width: 'auto',
        textTransform: 'capitalize',
    },
    optionButtonLabel: {
        //fontSize: 16,
    },

    /* Error Chip */
    chipRoot: {
        backgroundColor: 'rgba(127, 10, 10, 0.76)',
        paddingTop: '3px',
    },
    chipLabel: {
        paddingLeft: '0px',
    },
    chipAvatarRoot: {
        margin: 5,
        textAlign: 'center',
        color: theme.palette.common.white,
        backgroundColor: 'transparent',
    },
});


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',

            success: false,
            errorMessage: '',
        };

        this.handleUserLogin = this.handleUserLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    /***** Event Handling *****/
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
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };


    /***** Rendering *****/
    /* Rendering entry point */
    render() {
        return(
            <div className="accounts-background">   {/* Cool background image */}
                <div className="accounts-background-color accounts-grid">   {/* Purple gradient overlay */}
                    {/* Body */}
                    {this.renderUserLogin()};

                    {/* Footer */}
                    <AccountsLoginFooter classes={this.props.classes} />
                </div>
            </div>
        );
    }

    /*
     * Main login form that handles actual logins.
     */
    renderUserLogin() {
        const { classes } = this.props;

        return(
            <div style={{ gridArea: 'body', textAlign: 'center' }}>
                {/* Logo */}
                <img className="accounts-logo" src="/logos/logo-bulb_256x256.png" />

                {/* Words */}
                <Text style={{ color: 'white', paddingBottom: '10px' }} align="center" type="display3" text="Welcome Back!" />
                <Text style={{ color: 'white', paddingBottom: '30px' }} align="center" type="display1" text="Let's get to work." />

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
                        margin="normal"
                        fullWidth

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
                        margin="normal"
                        fullWidth

                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        required
                    />

                    {/* Forgot Password Optional Button */}
                    <div className="accounts-align-right">
                        <Link to="/login/forgot-password">
                            <Button
                                classes={{
                                    root: classes.optionButtonRoot,
                                    label: classes.optionButtonLabel,
                                }}
                            >
                                <strong><em>I forgot my password</em></strong>
                            </Button>
                        </Link>
                    </div>

                    {/* Login Main Button */}
                    <div style={{ textAlign: 'center' }}>
                        <FlatColoredButton
                            classes={{
                                root: classes.buttonRoot,
                                label: classes.buttonLabel,
                            }}
                            onClick={this.handleUserLogin} content="Login"
                        />
                    </div>

                    {/* Home Main Button */}
                    <div style={{ paddingTop: '10px', textAlign: 'center' }}>
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


export default withStyles(styles)(Login);

/*
 * Footer for Login Accounts page.
 */
const AccountsLoginFooter = ({ classes }) => (
    <div style={{ gridArea: 'footer', width: '100%', height: '100%' }}>
        <Text style={{ paddingTop: '30px', color: 'white' }} align="center" type="title"
            text={
                <div>New User?<Link to="/signup">
                    <Button classes={{ root: classes.optionButtonRoot, label: classes.optionButtonLabel }}>
                        <strong>CREATE AN ACCOUNT</strong>
                    </Button>
                </Link></div>
            }
        />
    </div>
);


/* Maybe useful? */
const StaffOption = ({ classes }) => (
    <div style={{ textAlign: 'right' }}>
        <Route exact path="/login" render={() => (
            <Link to="/login/staff" replace>
                <Button classes={{ root: classes.optionButtonRoot, label: classes.optionButtonLabel, }}>
                    <strong><em>Staff Login</em></strong>
                </Button>
            </Link>
        )} />
        <Route exact path="/login/staff" render={() => (
            <Link to="/login" replace>
                <Button classes={{ root: classes.optionButtonRoot, label: classes.optionButtonLabel, }}>
                    <strong><em>User Login</em></strong>
                </Button>
            </Link>
        )} />
    </div>
);
