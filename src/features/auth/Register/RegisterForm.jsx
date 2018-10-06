import React from 'react';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import TextInput from '../../../app/common/form/TextInput';
import { combineValidators, isRequired } from 'revalidate';
import { registerUser } from '../authActions';
import SocialLogin from '../SocialLogin/SocialLogin';
import { t } from '@lingui/macro';

const actions = {
  registerUser
};
const validate = combineValidators({
  displayName: isRequired('displayName'),
  email: isRequired('email'),
  password: isRequired('password')
});

const RegisterForm = ({ handleSubmit, registerUser, error, invalid, submitting, i18n }) => {
  return (
    <div>
      <Form size="large" onSubmit={handleSubmit(registerUser)}>
        <Segment>
          <Field name="displayName" type="text" component={TextInput} placeholder={i18n._(t`Known as`)} />
          <Field name="email" type="text" component={TextInput} placeholder="Email" />
          <Field name="password" type="password" component={TextInput} placeholder={i18n._(t`Password`)} />
          {error && (
            <Label basic color="red">
              {error}
            </Label>
          )}
          <Button disabled={invalid || submitting} fluid size="large" color="teal">
            {i18n._(t`Register`)}
          </Button>
          <Divider horizontal>Or</Divider>
          <SocialLogin i18n={i18n} />
        </Segment>
      </Form>
    </div>
  );
};

export default connect(
  null,
  actions
)(reduxForm({ form: 'registerForm', validate })(RegisterForm));
