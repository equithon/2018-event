import React, { Component } from 'react';

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
            errorMessage: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ email: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        console.log("SEND PASSWORD RECOVERY EMAIL HERE");

        this.setState({ success: true });
    }

    render() {
        const centerInScreen = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        };

        return(
            <Modal
                aria-labelledby="Forgot Password"
                aria-describedby="Enter your email so that we can send you a password recovery link."
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <div style={centerInScreen}>
                    <Paper style={{ padding: '50px' }} elevation={5}>
                        <Text color="primary" type="headline" align="center" text="Forget your password?" />
                        <Text color="secondary" type="body2" align="center"
                            text="Reset your password by entering your email address below." />

                        <form onSubmit={this.handleSubmit}>
                            <div style={{ textAlign: 'center' }}>
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
                                <FlatColoredButton onClick={this.handleSubmit} content="Submit" />
                            </div>
                        </form>
                    </Paper>
                </div>
            </Modal>
        );
    }
}
