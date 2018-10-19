import React from 'react';
import { Trans } from '@lingui/macro';
import { List, Image } from 'semantic-ui-react';
const languages = {
  en: 'English',
  vi: 'Vietnam'
};
const HomePage = ({ history, handleSetLanguage }) => {
  return (
    <div>
      <div className="ui inverted vertical masthead center aligned segment">
        <List horizontal relaxed>
          {Object.keys(languages).map(language => (
            <List.Item key={language}>
              <Image src={`/assets/${language}.png`} />
              <List.Content>
                <List.Header as="a" onClick={() => handleSetLanguage(language)}>
                  <span style={{ color: 'white' }}>{languages[language]}</span>
                </List.Header>
              </List.Content>
            </List.Item>
          ))}
        </List>
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
