import React, { Component } from 'react';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

/*
 * Some components for standard social media buttons.
 * StayPosted is raised button while the Facebook,
 * Twitter, and Instagram buttons will appear as icons.
 */
export function Facebook() {
    return(
        <IconButton color="primary">
            <i className="fab fa-facebook-f fa-lg"></i>
        </IconButton>
    );
}

export function Twitter() {
    return(
        <IconButton color="primary">
            <i className="fab fa-twitter fa-lg"></i>
        </IconButton>
    );
}

export function Instagram() {
    return(
        <IconButton color="primary">
            <i className="fab fa-instagram fa-lg"></i>
        </IconButton>
    );
}
