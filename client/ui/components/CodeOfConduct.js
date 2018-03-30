import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import { Tracker } from 'meteor/tracker';

import Text from "/client/ui/components/Text.js";
import HomeAppBar from '/client/ui/components/HomeAppBar.js';

const styles = theme => ({
    /* Text Fields */
    textFieldInput: {
        padding: '3px 12px',
    },
    longTextFieldRoot: {
        padding: '7 px'
    },
    longTextFieldInput: {
        padding: '10px 12px',
        backgroundColor: theme.palette.primary['A200'],
        borderRadius: '5px',
        border: '1px solid ' + theme.palette.primary[500],
    },
});



class CodeOfConduct extends Component {
    constructor(props) {
        super(props);
    }


    /***** Rendering *****/
    /* Rendering entry point */
    render() {

	return(
		<div id="conduct-wrapper">
		<HomeAppBar />
		<Paper id="code-of-conduct">
		<div style={{display: 'grid', gridRowGap: '10px', gridTemplateRows: 'auto', gridArea: 'code-of-conduct'}}>
                        <Text align="center" color="primary" type="headline" text="Equithon Code of Conduct" />

                        {/* Institution Field */}
                        <Text type="body1" text="body text" />
                        <br/></div>
        </Paper>
        </div>
		);
	}
}
export default withStyles(styles)(CodeOfConduct);