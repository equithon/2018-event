import React, { Component } from 'react';

import ReCaptcha from 'react-recaptcha';

import Modal from 'material-ui/Modal';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import Text from '/client/ui/components/Text.js';
import FlatColoredButton from '/client/ui/buttons/FlatColoredButton.js';

/*
 * Popup modal for user to input their email to have a password recovery link
 * sent to them.
 * Props:
 * - open
 * - onClose
 */
export default class ForgotPasswordModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',

            success: false,
            messageVisible: false,
            errorMessage: '',

            captchaToken: '',
        }

        this.recaptchaInstance;

        this.handleChange  = this.handleChange.bind(this);
        this.handleSubmit  = this.handleSubmit.bind(this);
        this.handleCaptcha = this.handleCaptcha.bind(this);
    }

    handleChange(event) {
        this.setState({ email: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.email && this.state.captchaToken) {
            Meteor.call('user.verifyCaptchaAndResetPassword',
                { email: this.state.email, captchaToken: this.state.captchaToken },
                (err, res) => {
                    if (err) {
                        this.setState({
                            success: false,
                            messageVisible: true,
                            errorMessage: err.reason,
                        });
                        this.recaptchaInstance.reset();
                    } else {
                        this.setState({
                            success: true,
                            messageVisible: true,
                            errorMessage: '',
                        });
                    }
                }
            );
        }
    }

    /* Update the captcha with a new response token */
    handleCaptcha(responseToken) {
        this.setState({
            captchaToken: responseToken,
        });
    };

    render() {
        return(
            <Modal
                aria-labelledby="Forgot Password"
                aria-describedby="Enter your email so that we can send you a password recovery link."
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <div className="center-screen-modal">
                    <Paper className="modal-paper" elevation={5}>
                        <Text color="primary" type="headline" align="center" text="Forget your password?" />
                        <Text color="secondary" type="body2" align="center"
                            text="Reset your password by entering your email address below." />

                        <form onSubmit={this.handleSubmit}>
                            <div style={{ textAlign: 'center', paddingBottom: '10px' }}>
                                {/* Email Field */}
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    style={{ paddingBottom: '10px' }}
                                    label="Email Address"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    required
                                />

                                {/* Submit */}
                                <FlatColoredButton style={{ fontSize: 24, width: '50%' }} onClick={this.handleSubmit} content="〉"/>

                                {/* Google recaptcha */}
                                <div className="recaptcha-div">
                                    <ReCaptcha
                                        style={{height: '175px'}}
                                        ref={ e => this.recaptchaInstance = e }
                                        sitekey="6Le7Q0UUAAAAANyBTNvLsxFogP8m3IATJPNofL8n"
                                        render="explicit"
                                        verifyCallback={this.handleCaptcha}
                                        size="compact"
                                    />
                                </div>
                            </div>
                        </form>

                        <div style={{ visibility: (this.state.messageVisible) ? 'visible' : 'hidden' }}>
                            <Text type="body1" color={ (this.state.success) ? 'primary' : 'error' }
                                text={ (this.state.success) ? 'We sent you a password recovery link.' : this.state.errorMessage } />
                        </div>
                    </Paper>
                </div>
            </Modal>
        );
    }
}
