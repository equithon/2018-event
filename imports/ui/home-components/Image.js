import React, { Component } from 'react';
import Typography from 'material-ui/Typography';

/*
 * Component to place images in the grid cells of the home page.
 */
class Image extends Component {
  constructor(props) {
    super(props);
  };

  getSrc() {
    if ('src' in this.props && this.props.src !== undefined) return this.props.src;
    else return "";
  }

  getStyle() {
    if ('style' in this.props && this.props.style !== undefined) return this.props.style;
    else return {};
  }

  getGridArea() {
    if ('gridArea' in this.props && this.props.gridArea !== undefined)
      return this.props.gridArea;
    else return {};
  }

  render() {
    return(
      <div style={{gridArea: this.getGridArea()}}>
        <img style={this.getStyle()} src={this.getSrc()} />
      </div>
    );
  }
}

export default Image;
