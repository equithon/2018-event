import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { theme } from '/client/ui/CustomTheme.js';

export default function FlatColoredButton(props) {
    return(
        <Button
            style={ Object.assign({background: theme.palette.primary[500], borderRadius: '25px' }, props.style) }
            color="contrast"
            onClick={props.onClick}
        >
            {props.content}
        </Button>
    );
}
