import React, { Component } from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';

/*
 * Some components for standard social media buttons.
 * StayPosted is raised button while the Facebook,
 * Twitter, and Instagram buttons will appear as icons.
 * 
 * They currently only have AddIcon as a placeholder
 * while we get resources for the actual look of the icons.
 */
export function StayPosted() {
  return(
    <Button raised color="primary">
      Stay Posted
    </Button>
  );
}

export function Facebook() {
  return(
    <IconButton color="primary">
      <AddIcon />
    </IconButton>
  );
}

export function Twitter() {
  return(
    <IconButton color="primary">
      <AddIcon />
    </IconButton>
  );
}

export function Instagram() {
  return(
    <IconButton color="primary">
      <AddIcon />
    </IconButton>
  );
}
