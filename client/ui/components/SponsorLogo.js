import React, { Component } from 'react';

export default class SponsorLogo extends Component {
    render() {
        const ImageStyle = {
            alignSelf: 'center',
            flex: 'flex-shrink',
            padding: 25,
            width: this.props.width ? this.props.width : 300,
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
