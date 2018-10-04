import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

const LoadingComponent = withI18n()(({ i18n, inverted }) => {
  return (
    <Dimmer inverted={inverted} active={true}>
      <Loader content={i18n._(t`Loading...`)} />
    </Dimmer>
  );
});

export default LoadingComponent;
