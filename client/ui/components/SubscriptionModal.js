import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Modal from 'material-ui/Modal';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import Text from '/client/ui/components/Text.js';
import { EmailSubscriptions } from '/imports/api/email-subscriptions.js';


/* Popup modal for user to input email to subscribe to email notifications.
 * Borrowed from https://material-ui-next.com/demos/modals/ example.
 * Props:
 * - open
 * - onClose
 */
class SubscriptionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      successMessageVisible: 'hidden'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(event) {
    this.setState({ value:  event.target.value });
    console.log('Change made: ' + this.state.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('Value submitted: ' + this.state.value);

    EmailSubscriptions.insert({
      email: this.state.value,
      createdAt: new Date()
    });

    this.setState({
      value: '',
      successMessageVisible: 'visible'
    });
  }

  render() {
    style = {
      // Center in screen
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };

    return(
      <Modal
        aria-labelledby="Email Subscription"
        aria-describedby="Subscribe with your email account for Equithon notifications by email."
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <div style={style}>
          <Paper style={{ padding: '50px' }} elevation={5}>
            <Text color='primary' type='display1' text='Email Subscription' />
            <br/>
            <Text type='body1' text='Submit your email below to subscribe to the latest Equithon news.' />

            <form onSubmit={this.handleSubmit}>
              <div className='split-column-row'>
                <div style={{ gridArea: 'left', textAlign: 'left'}}>
                  <TextField
                    style={{ float: 'left', width: '100%' }}
                    label='Your Email Address'
                    margin='normal'
                    value={this.state.value}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div style={{ gridArea: 'right', padding: '20px' }}>
                  <Button style={{ width: '100%' }}
                    raised color='primary' onClick={this.handleSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
            </form>

            <div style={{ visibility: this.state.successMessageVisible }} ref="success">
              <Text type='body1' color='accent' text='Your email was successfully submitted.' />
            </div>
          </Paper>
        </div>
      </Modal>
    );
  }
}

export default SubscriptionModal;
