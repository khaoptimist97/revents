import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { UserIsAuthenticated } from '../../features/auth/authWrapper';
import { I18nProvider } from '@lingui/react';
import { withRouter } from 'react-router';

// import catalogVi from '../../locale/vi/messages';
// import catalogEn from '../../locale/en/messages';

const AsyncHomePage = Loadable({
  loader: () => import('../../features/home/HomePage'),
  loading: LoadingComponent
});
const AsyncNavBar = Loadable({
  loader: () => import('../../features/nav/NavBar/NavBar'),
  loading: LoadingComponent
});
const AsyncEventForm = Loadable({
  loader: () => import('../../features/event/EventForm/EventForm'),
  loading: LoadingComponent
});
const AsyncEventDashboard = Loadable({
  loader: () => import('../../features/event/EventDashboard/EventDashboard'),
  loading: LoadingComponent
});
const AsyncEventDetailedPage = Loadable({
  loader: () => import('../../features/event/EventDetailed/EventDetailedPage'),
  loading: LoadingComponent
});
const AsyncPeopleDashboard = Loadable({
  loader: () => import('../../features/user/PeopleDashboard/PeopleDashboard'),
  loading: LoadingComponent
});
const AsyncUserDetailedPage = Loadable({
  loader: () => import('../../features/user/UserDetailed/UserDetailedPage'),
  loading: LoadingComponent
});
const AsyncSettingsDashboard = Loadable({
  loader: () => import('../../features/user/settings/SettingsDashboard'),
  loading: LoadingComponent
});
const AsyncNotFound = Loadable({
  loader: () => import('../../app/layout/NotFound'),
  loading: LoadingComponent
});
const AsyncModalManager = Loadable({
  loader: () => import('../../features/modals/ModalManager'),
  loading: LoadingComponent
});

class App extends Component {
  state = {
    language: 'en',
    catalogs: {}
  };
  loadLanguage = async language => {
    const catalogs = await import(`../../locale/${language}/messages`);
    this.setState(state => ({
      catalogs: {
        ...state.catalogs,
        [language]: catalogs
      }
    }));
  };
  componentDidMount() {
    this.loadLanguage(this.state.language);
  }
  componentWillUpdate(nextProps, { language, catalogs }) {
    if (language !== this.state.language && !catalogs[language]) {
      this.loadLanguage(language);
      return false;
    }
    return true;
  }
  handleSetLanguage = language => {
    this.setState({ language });
  };

  render() {
    const { language, catalogs } = this.state;
    const Authenticated = UserIsAuthenticated(({ children, ...props }) => React.cloneElement(children, props));
    return (
      <I18nProvider language={language} catalogs={catalogs}>
        <div>
          <AsyncModalManager />
          <Switch>
            <Route
              exact
              path="/"
              render={routeProps => <AsyncHomePage {...routeProps} handleSetLanguage={this.handleSetLanguage} />}
            />
          </Switch>
          <Route
            path="/(.+)"
            render={() => (
              <div>
                <AsyncNavBar />
                <Container className="main">
                  <Switch>
                    <Route
                      path="/events"
                      render={routeProps => (
                        <AsyncEventDashboard {...routeProps} activeLanguage={this.state.language} />
                      )}
                    />
                    <Route
                      path="/event/:id"
                      render={routeProps => (
                        <AsyncEventDetailedPage {...routeProps} activeLanguage={this.state.language} />
                      )}
                    />
                    <Route path="/manage/:id" component={UserIsAuthenticated(AsyncEventForm)} />
                    <Route path="/people" component={UserIsAuthenticated(AsyncPeopleDashboard)} />

                    <Route path="/profile/:id" component={UserIsAuthenticated(AsyncUserDetailedPage)} />

                    <Route path="/settings" component={UserIsAuthenticated(AsyncSettingsDashboard)} />
                    <Route path="/createEvent" component={UserIsAuthenticated(AsyncEventForm)} />
                    <Route path="/error" component={AsyncNotFound} />
                    {/* Every wrong path return to Not found component */}
                    <Route component={AsyncNotFound} />
                  </Switch>
                </Container>
              </div>
            )}
          />
        </div>
      </I18nProvider>
    );
  }
}

export default withRouter(App);
