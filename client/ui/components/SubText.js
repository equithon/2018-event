import React, {Component } from 'react';

import Text from '/client/ui/components/Text.js';
import { withTheme } from 'material-ui/styles';

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
      <div className='subtext-grid' style={{backgroundColor: this.props.theme.palette.primary[500]}}>
        <div style={{gridArea: 'left', padding: '5px', backgroundColor: 'white'}}>
          <Text type="title" align="right" text="When" />
          <Text type="subheading" align="right" text="May 2018" />
        </div>

        <div style={{gridArea: 'right', padding: '5px', backgroundColor: 'white'}}>
          <Text type="title" align="left" text="Where" />
          <Text type="subheading" align="left" text="University of Waterloo" />
        </div>
      </div>
    );
  }
}

export default withTheme()(SubText);
