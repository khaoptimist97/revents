import React, { Component } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { Menu, Container, Button } from 'semantic-ui-react';
import { withFirebase } from 'react-redux-firebase'; //Want to access to firebase funtionalities, passes firebase as a prop
import { connect } from 'react-redux';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import { openModal } from '../../modals/modalActions';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

const mapState = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

const actions = {
  openModal
};
export class NavBar extends Component {
  state = {
    authenticated: false
  };
  handleSignIn = () => {
    this.props.openModal('LoginModal', { i18n: this.props.i18n });
  };
  handleRegister = () => {
    this.props.openModal('RegisterModal', { i18n: this.props.i18n });
  };
  handleSignOut = () => {
    this.props.firebase.logout();
    this.props.history.push('/'); // Redirect ve homepage
  };
  render() {
    const { auth, profile, i18n } = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={Link} to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            Re-vents
          </Menu.Item>
          <Menu.Item as={NavLink} to="/events" name={i18n._(t`Events`)} />
          {authenticated && <Menu.Item as={NavLink} to="/people" name={i18n._(t`People`)} />}
          {authenticated && (
            <Menu.Item>
              <Button as={Link} to="/createEvent" floated="right" positive inverted content={i18n._(t`Create Event`)} />
            </Menu.Item>
          )}
          {authenticated ? (
            <SignedInMenu auth={auth} profile={profile} signOut={this.handleSignOut} i18n={i18n} />
          ) : (
            <SignedOutMenu signIn={this.handleSignIn} register={this.handleRegister} i18n={i18n} />
          )}
        </Container>
      </Menu>
    );
  }
}
export default withI18n()(
  withRouter(
    withFirebase(
      connect(
        mapState,
        actions
      )(NavBar)
    )
  )
);
