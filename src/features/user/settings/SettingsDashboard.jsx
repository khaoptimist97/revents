import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import SettingsNav from './SettingsNav';
import BasicPage from './BasicPage';
import AboutPage from './AboutPage';
import PhotosPage from './PhotosPage';
import AccountPage from './AccountPage';
import { updatePassword } from '../../auth/authActions';
import { updateProfile } from '../userActions';
import { withI18n } from '@lingui/react';

const actions = {
  updatePassword,
  updateProfile
};

const mapState = state => ({
  providerId: state.firebase.auth.providerData[0].providerId,
  user: state.firebase.profile
});

const SettingsDashboard = ({ updatePassword, providerId, user, updateProfile, i18n }) => {
  return (
    <Grid>
      <Grid.Column width={12}>
        <Switch>
          <Redirect exact from="/settings" to="/settings/basic" />
          <Route
            path="/settings/basic"
            render={() => <BasicPage initialValues={user} updateProfile={updateProfile} i18n={i18n} />}
          />
          <Route
            path="/settings/about"
            render={() => <AboutPage initialValues={user} updateProfile={updateProfile} i18n={i18n} />}
          />
          <Route path="/settings/photos" render={() => <PhotosPage i18n={i18n} />} />
          <Route
            path="/settings/account"
            render={() => <AccountPage updatePassword={updatePassword} providerId={providerId} i18n={i18n} />}
          />
        </Switch>
      </Grid.Column>
      <Grid.Column width={4}>
        <SettingsNav i18n={i18n} />
      </Grid.Column>
    </Grid>
  );
};

export default withI18n()(
  connect(
    mapState,
    actions
  )(SettingsDashboard)
);
