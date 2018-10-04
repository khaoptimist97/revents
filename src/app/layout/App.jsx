import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { UserIsAuthenticated } from '../../features/auth/authWrapper';
import { I18nProvider } from '@lingui/react';
import catalogVi from '../../locale/vi/messages';
import catalogEn from '../../locale/en/messages';
import { setupI18n } from '@lingui/core';

export const i18n = setupI18n();

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
  render() {
    return (
      <I18nProvider language="vi" catalogs={{ vi: catalogVi }}>
        <div>
          <AsyncModalManager />
          <Switch>
            <Route exact path="/" component={AsyncHomePage} />
          </Switch>
          <Route
            path="/(.+)"
            render={() => (
              <div>
                <AsyncNavBar />
                <Container className="main">
                  <Switch>
                    <Route path="/events" component={AsyncEventDashboard} />
                    <Route path="/event/:id" component={AsyncEventDetailedPage} />
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

export default App;
