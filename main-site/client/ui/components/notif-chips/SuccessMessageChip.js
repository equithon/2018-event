import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import Text from '/client/ui/components/Text.js';

/* Success Chip Styles */
const styles = theme => ({
    chipRoot: {
        backgroundColor: 'green',
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

/* Useful success message chip to render for forms */
class SuccessMessageChip extends Component {
    render() {
        const { classes, successMessage } = this.props;

        if (!successMessage) return false;

        return(
            <Chip
                classes={{
                    root: classes.chipRoot,
                    label: classes.chipLabel,
                }}
                avatar={
                    <Avatar
                        className={ classes.chipAvatarRoot }
                        children={ <i className="fas fa-check"></i> }
                    ></Avatar>
                }
                label={ <Text style={{ color: 'white' }} type="body2" text={successMessage} />}
            />
        );
    }
};

export default withStyles(styles)(SuccessMessageChip);
