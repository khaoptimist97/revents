import React from 'react';
import { Grid, Menu, Header } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { t } from '@lingui/macro';

const SettingsNav = ({ i18n }) => {
  return (
    <Grid.Column width={4}>
      <Menu vertical>
        <Header icon="user" attached inverted color="grey" content={i18n._(t`Profile`)} />
        <Menu.Item as={NavLink} to="/settings/basic">
          {i18n._(t`Basics`)}
        </Menu.Item>
        <Menu.Item as={NavLink} to="/settings/about">
          {i18n._(t`About me`)}
        </Menu.Item>
        <Menu.Item as={NavLink} to="/settings/photos">
          {i18n._(t`My Photos`)}
        </Menu.Item>
      </Menu>
      <Grid.Row />
      <Menu vertical>
        <Header icon="settings" attached inverted color="grey" content={i18n._(t`Account`)} />
        <Menu.Item as={NavLink} to="/settings/account">
          {i18n._(t`My Account`)}
        </Menu.Item>
      </Menu>
    </Grid.Column>
  );
};

export default SettingsNav;
