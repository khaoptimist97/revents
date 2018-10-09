import React from 'react';
import { Trans } from '@lingui/macro';

const HomePage = ({ history }) => {
  return (
    <div>
      <div className="ui inverted vertical masthead center aligned segment">
        <div className="ui text container">
          <h1 className="ui inverted stackable header">
            <img className="ui image massive" src="/assets/logo.png" alt="logo" />
            <div className="content">Re-vents</div>
          </h1>
          <h2>
            <Trans id="appName">Do whatever you want to do</Trans>
          </h2>
          <div onClick={() => history.push('/events')} className="ui huge white inverted button">
            <Trans id="app.GetStarted">Get Started</Trans>
            <i className="right arrow icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
