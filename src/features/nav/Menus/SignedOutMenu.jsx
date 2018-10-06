import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { t } from '@lingui/macro';


const SignedOutMenu = ({ signIn, register, i18n }) => {
  return (
    <Menu.Item position="right">
      <Button onClick={signIn} basic inverted content={i18n._(t`Login`)} />
      <Button onClick={register} basic inverted content={i18n._(t`Register`)} style={{ marginLeft: '0.5em' }} />
    </Menu.Item>
  );
};

export default SignedOutMenu;
