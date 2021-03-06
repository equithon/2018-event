import React, { Component } from 'react';

import { Tracker } from 'meteor/tracker';

import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

import { appsClosed } from '/imports/api/AppCloseDate.js';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

/* The AppBar for use across the application.
 * This is currently a bar with the logo in the middle.
 * We would add buttons etc. to this as we add new features.
 */
export default class HomeAppBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTeam: false
        };
    }

    componentDidMount() {
        this.userC = Tracker.autorun(() => {
            Meteor.subscribe('userData');

            let user = Meteor.user();
            if (user && user.isTeam !== undefined) {
                this.setState({
                    isTeam: user.isTeam
                });
            } else {
                this.setState({
                    isTeam: false,
                });
            }
        });
    }

    componentWillUnmount() {
        this.userC.stop();
    }

    renderAppButton(closed) {
        if (this.state.isTeam) return <AppbarButton link="/team" text="Team Home" iconClass="fas fa-home" />;
        else if (closed) return <AppbarButton link="/apply" text="View Application" iconClass="fas fa-file" />;
        return <AppbarButton link="/apply" text="Apply to Equithon" iconClass="fas fa-file" />;
    }

    render() {
        var closed = appsClosed();

        return (
            <AppBar id="appbar" position="fixed" color="inherit">
                <Toolbar>
                    <div id="app-bar-grid">
                        {/* Application */}
                        { (this.props.noAppButton) ? false :
                            <div style={{ gridArea: 'application', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                { this.renderAppButton(closed) }
                            </div>
                        }

                        {/* Logo */}
                        <div style={{ gridArea: 'logo', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Link className="button-link" to="/">
                                <img className="equithon-logo" src="/logos/logo-bulb_417x417.png" />
                            </Link>
                        </div>

                        {/* Signup */}
                        { (closed || Meteor.userId()) ? false :
                            <div style={{ gridArea: 'signup', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <AppbarButton link="/accounts/signup" text="Signup" iconClass="fas fa-user-plus" />
                            </div>
                        }

                        {/* Login/Logout */}
                        <div style={{ gridArea: 'login-logout', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            { (Meteor.userId()) ?
                                <AppbarButton link="/accounts/logout" text="Logout" iconClass="fas fa-sign-out-alt" /> :
                                <AppbarButton link="/accounts/login" text="Login" iconClass="fas fa-sign-in-alt" />
                            }
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

const AppbarButton = ({ link, text, iconClass }) => (
    <Link className="button-link" to={link}>
        <MediaQuery maxDeviceWidth={600}>
            { (matches) => (matches) ?
                <IconButton color="primary"><i className={iconClass}></i></IconButton> :
                <Button style={{ lineHeight: '80px' }} color="primary">{text}</Button>
            }
        </MediaQuery>
    </Link>
);
