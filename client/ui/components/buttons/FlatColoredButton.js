import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { theme } from '/client/ui/CustomTheme.js';

/*
 * Standardized flat button we use for most things.
 * Props:
 * - style
 * - disabled
 * - classes
 * - onClick
 * - content
 */
export default function FlatColoredButton(props) {
    return(
        <Button
            style={ Object.assign({background: theme.palette.primary[500], borderRadius: '25px', color: 'white' }, props.style) }
            disabled={ props.disabled }
            classes={ props.classes }
            onClick={props.onClick}
        >
            {props.content}
        </Button>
    );
}
