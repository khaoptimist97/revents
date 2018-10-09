import React from 'react';
import { Segment, Header, Form, Divider, Label, Button, Icon } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import { combineValidators, isRequired, matchesField, composeValidators } from 'revalidate';
import { t } from '@lingui/macro';
import { Trans } from '@lingui/macro';

const validate = combineValidators({
  newPassword1: isRequired({ message: 'Please enter a password' }),
  newPassword2: composeValidators(
    isRequired({ message: 'Please confirm your password' }),
    matchesField('newPassword1')({ message: 'Passwords do not match' })
  )()
});

const AccountPage = ({ error, invalid, submitting, handleSubmit, updatePassword, providerId, i18n }) => {
  return (
    <Segment>
      <Header dividing size="large" content={i18n._(t`Account`)} />
      {providerId &&
        providerId === 'password' && (
          <div>
            <Header color="teal" sub content={i18n._(t`Change password`)} />
            <p>
              <Trans id="account.userForm">Use this form to update your account settings</Trans>
            </p>
            <Form onSubmit={handleSubmit(updatePassword)}>
              <Field
                width={8}
                name="newPassword1"
                type="password"
                pointing="left"
                inline={true}
                component={TextInput}
                basic={true}
                placeholder={i18n._(t`New Password`)}
              />
              <Field
                width={8}
                name="newPassword2"
                type="password"
                inline={true}
                basic={true}
                pointing="left"
                component={TextInput}
                placeholder={i18n._(t`Confirm Password`)}
              />
              {error && (
                <Label basic color="red">
                  {error}
                </Label>
              )}
              <Divider />
              <Button disabled={invalid || submitting} size="large" positive content={i18n._(t`Update Password`)} />
            </Form>
          </div>
        )}
      {providerId &&
        providerId === 'facebook.com' && (
          <div>
            <Header color="teal" sub content={i18n._(t`Facebook Account`)} />
            <p>
              <Trans id="account.facebook">Please visit Facebook to update your account settings</Trans>
            </p>
            <Button type="button" color="facebook">
              <Icon name="facebook" />
              <Trans id="account.goFB">Go to Facebook</Trans>
            </Button>
          </div>
        )}
      {providerId &&
        providerId === 'google.com' && (
          <div>
            <Header color="teal" sub content="Google Account" />
            <p>
              <Trans id="account.google">Please visit Google to update your account settings</Trans>
            </p>
            <Button type="button" color="google plus">
              <Icon name="google plus" />
              <Trans id="account.goGG">Go to Google</Trans>
            </Button>
          </div>
        )}
    </Segment>
  );
};

export default reduxForm({ form: 'account', validate })(AccountPage);
