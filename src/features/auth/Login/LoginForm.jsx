import React from 'react';
import { connect } from 'react-redux';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import { login } from '../authActions';
import SocialLogin from '../SocialLogin/SocialLogin';
import { socialLogin } from '../authActions';
import { t } from '@lingui/macro';

const actions = {
  login,
  socialLogin
};
const LoginForm = ({ login, handleSubmit, error, socialLogin, i18n }) => {
  return (
    <Form size="large" onSubmit={handleSubmit(login)}>
      <Segment>
        <Field name="email" component={TextInput} type="text" placeholder="Email" />
        <Field name="password" component={TextInput} type="password" placeholder={i18n._(t`Password`)} />
        {error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
        <Button fluid size="large" color="teal">
          {i18n._(t`Login`)}
        </Button>
        <Divider horizontal>Or</Divider>
        <SocialLogin socialLogin={socialLogin} i18n={i18n} />
      </Segment>
    </Form>
  );
};

export default connect(
  null,
  actions
)(reduxForm({ form: 'loginForm' })(LoginForm));
