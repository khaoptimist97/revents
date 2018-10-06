import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { t } from '@lingui/macro';

const SocialLogin = ({ socialLogin, i18n }) => {
  return (
    <div>
      <Button
        onClick={() => socialLogin('facebook')} //Pass a provider nen dung arrow function
        type="button"
        style={{ marginBottom: '10px' }}
        fluid
        color="facebook"
        acebook
      >
        <Icon name="facebook" /> {i18n._(t`Login with`)} Facebook
      </Button>

      <Button onClick={() => socialLogin('google')} type="button" fluid color="google plus">
        <Icon name="google plus" />
        {i18n._(t`Login with`)} Google
      </Button>
    </div>
  );
};

export default SocialLogin;
