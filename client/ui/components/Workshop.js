import React, { Component } from 'react';

import Paper from 'material-ui/Paper';

import HomeAppBar from '/client/ui/components/HomeAppBar.js';
import Text from '/client/ui/components/Text.js';


/*
 * Workshop page for information
 * ------ PLACEHOLDER ------
 */
export default class Workshop extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="basic-page">
                <HomeAppBar />

                <Text style={{ gridArea: 'title-row', paddingTop: '10px' }}
                     align="center" color="primary" type="display2" text="Workshop Materials" />

                <Paper className="form-paper">
                    <Text color="inherit" type="body2"
                        text="We'll be posting workshop slides and required downloads on this page soon! All materials will be posted by May 2." />
                </Paper>
            </div>
        );
    }
}
