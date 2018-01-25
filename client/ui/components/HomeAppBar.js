import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

import { Link } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

/* The AppBar for use across the application.
 * This is currently a bar with the logo in the middle.
 * We would add buttons etc. to this as we add new features.
 */
export default class HomeAppBar extends Component {
    render() {
        return (
            <AppBar id="appbar" position="fixed" color="inherit">
                <Toolbar>
                    <div id="app-bar-grid">
                        <img style={{ gridArea: 'logo' }} className="equithon-logo" src="/logos/logo-bulb_417x417.png" />
                        <div style={{ gridArea: 'login', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Link to="/login" replace>
                                <MediaQuery maxDeviceWidth={600}>
                                    { (matches) => (matches) ?
                                        <IconButton color="primary"><i className="fas fa-sign-in-alt"></i></IconButton> :
                                        <Button color="inherit">Login</Button>
                                    }
                                </MediaQuery>
                            </Link>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}
