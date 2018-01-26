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
                        {/* Logo */}
                        <Link style={{gridArea: 'logo', margin: '0 auto' }} to="/">
                            <img className="equithon-logo" src="/logos/logo-bulb_417x417.png" />
                        </Link>

                        {/* Signup */}
                        <div style={{ gridArea: 'signup', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <AppbarButton link="/signup" text="Signup" iconClass="fas fa-user-plus" />
                        </div>

                        {/* Login */}
                        <div style={{ gridArea: 'login', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <AppbarButton link="/login" text="Login" iconClass="fas fa-sign-in-alt" />
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

const AppbarButton = ({ link, text, iconClass }) => (
    <Link to={link}>
        <MediaQuery maxDeviceWidth={600}>
            { (matches) => (matches) ?
                <IconButton color="primary"><i className={iconClass}></i></IconButton> :
                <Button style={{ lineHeight: '80px' }} color="primary">{text}</Button>
            }
        </MediaQuery>
    </Link>
);
