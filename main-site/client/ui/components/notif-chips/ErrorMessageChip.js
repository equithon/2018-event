import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import Text from '/client/ui/components/Text.js';

/* Error Chip Styles */
const styles = theme => ({
    chipRoot: {
        backgroundColor: 'rgba(127, 10, 10, 0.76)',
        paddingTop: '3px',
        height: 'auto',
    },
    chipLabel: {
        paddingLeft: '0px',
        whiteSpace: 'normal',
    },

    /* Common Style */
    chipAvatarRoot: {
        margin: 5,
        textAlign: 'center',
        color: theme.palette.common.white,
        backgroundColor: 'transparent',
    },
});

/* Useful error message chip to render for forms */
class ErrorMessageChip extends Component {
    render() {
        const { classes, errorMessage } = this.props;

        if (!errorMessage) return false;

        return(
            <Chip
                classes={{
                    root: classes.chipRoot,
                    label: classes.chipLabel,
                }}
                avatar={
                    <Avatar
                        className={ classes.chipAvatarRoot }
                        children={ <i className="fas fa-exclamation"></i> }
                    ></Avatar>
                }
                label={ <Text style={{ color: 'white' }} type="body2" text={errorMessage} />}
            />
        );
    }
};

export default withStyles(styles)(ErrorMessageChip);
