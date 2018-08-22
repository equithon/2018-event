import React, { Component } from 'react';

import Text from '/client/ui/components/Text.js';


/*
 * Useful alert-box to be used for notification style alerts to users
 *
 * Props:
 * - type: [ 'notice', 'error', 'success', 'warning' ] // defined in main.css
 * - title: String
 * - message: String
 */
export default class AlertBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className={ 'alert-box ' + this.props.type } style={{ textAlign: 'left' }}>
                <span className="title" style={{ display: 'flex', wrap: 'flex-wrap' }}>
                    <i className="fas fa-info-circle" style={{ paddingRight: '5px' }}></i>
                    <Text type="body2" color="inherit" text={this.props.title} />
                </span>

                <Text type="body2" color="textSecondary" text={this.props.message} />
            </div>
        );
    }
};
