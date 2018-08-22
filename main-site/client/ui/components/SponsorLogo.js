import React, { Component } from 'react';

export default class SponsorLogo extends Component {
    render() {
        const ImageStyle = {
            alignSelf: 'center',
            flex: '0 0 ' + (this.props.targetWidth ? this.props.targetWidth : 300) + 'px',
            margin: 25,
            width: (this.props.targetWidth ? this.props.targetWidth : 300),
            maxWidth: '100%',
            minWidth: 150,
        };

        return (
            <img
                src={ this.props.src }
                alt={ this.props.alt }
                style={ ImageStyle }
            />
        );
    }
}
