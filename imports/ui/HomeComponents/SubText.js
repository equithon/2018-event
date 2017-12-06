import React, {Component } from 'react';
import Typography from 'material-ui/Typography';

const leftTextStyle = {
  float: 'left',
  width: '400px',
  paddingRight: '10px'
}
const dividerStyle = {
  borderLeft: '1px solid #AB6CFE',
  borderRight: '1px solid #AB6CFE',
  height: '50px',
  position: 'relative',
  float: 'left'
}
const rightTextStyle = {
  float: 'left',
  paddingLeft: '10px'
}

/*
 * A small subtext rendered on the top-right after the AppBar.
 * Intended to give some quick small details.
 */
class SubText extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return(
      <div className="app-body-cell" style={{height: '50px'}}>
        <div style={leftTextStyle}>
          <Typography type="title" align="right">SubTextTitle1</Typography>
          <Typography type="subheading" align="right">SubTextBody1</Typography>
        </div>

        <div style={dividerStyle}></div>

        <div style={rightTextStyle}>
          <Typography type="title" align="left">SubTextTitle2</Typography>
          <Typography type="subheading" align="left">SubTextBody2</Typography>
        </div>
      </div>
    );
  }
}

export default SubText;
