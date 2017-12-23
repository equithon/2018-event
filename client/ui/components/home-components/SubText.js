import React, {Component } from 'react';
import Typography from 'material-ui/Typography';
import { withTheme } from 'material-ui/styles';

const cellStyle = {
  height: '50px',
  align: 'right',
  margin: '0 0 0 auto',
  paddingRight: '10px',
  gridArea: 'st'
};
const leftTextStyle = {
  float: 'left',
  width: '125px',
  paddingRight: '20px'
};
const rightTextStyle = {
  float: 'left',
  width: 'auto',
  paddingLeft: '20px'
};

/*
 * A small subtext rendered on the top-right after the AppBar.
 * Intended to give some quick small details.
 */
class SubText extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const dividerStyle = {
      borderLeft: '1px solid ' + this.props.theme.palette.primary[500],
      borderRight: '1px solid ' + this.props.theme.palette.primary[500],
      height: '50px',
      position: 'relative',
      float: 'left'
    };

    return(
      <div style={cellStyle}>
        <div style={leftTextStyle}>
          <Typography type="title" align="right">When</Typography>
          <Typography type="subheading" align="right">May 2018</Typography>
        </div>

        <div style={dividerStyle}></div>

        <div style={rightTextStyle}>
          <Typography type="title" align="left">Where</Typography>
          <Typography type="subheading" align="left">University of Waterloo</Typography>
        </div>
      </div>
    );
  }
}

export default withTheme()(SubText);
