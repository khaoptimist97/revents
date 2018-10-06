import React from 'react';
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { t } from '@lingui/macro';

const SignedInMenu = ({ signOut, profile, auth, i18n }) => {
  return (
    <Menu.Item position="right">
      <Image avatar spaced="right" src={profile.photoURL || '/assets/user.png'} />
      <Dropdown pointing="top left" text={profile.displayName}>
        <Dropdown.Menu>
          <Dropdown.Item text={i18n._(t`Create Event`)} icon="plus" />
          <Dropdown.Item text={i18n._(t`My Events`)} icon="calendar" />
          <Dropdown.Item text={i18n._(t`My Network`)} icon="users" />
          <Dropdown.Item as={Link} to={`/profile/${auth.uid}`} text={i18n._(t`My Profile`)} icon="user" />
          <Dropdown.Item as={Link} to="/settings" text={i18n._(t`Settings`)} icon="settings" />
          <Dropdown.Item onClick={signOut} text={i18n._(t`Sign out`)} icon="power" />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
