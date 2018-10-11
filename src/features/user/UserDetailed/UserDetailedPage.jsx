import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { compose } from 'redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { connect } from 'react-redux';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedEvents from './UserDetailedEvents';
import UserDetailedSidebar from './UserDetailedSidebar';
import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents, followUser, unfollowUser } from '../../user/userActions';
import { toastr } from 'react-redux-toastr';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }
  return {
    profile,
    userUid,
    events: state.events,
    eventLoading: state.async.loading,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
    following: state.firestore.ordered.following
  };
};
const actions = {
  getUserEvents,
  followUser,
  unfollowUser
};

class UserDetailedPage extends Component {
  async componentDidMount() {
    let user = await this.props.firestore.get(`users/${this.props.match.params.id}`);
    if (!user.exists) {
      this.props.history.push('/error');
      toastr.error(this.props.i18n._(t`Not found`), this.props.i18n._(t`This is not the user you are looking for`));
    }
    await this.props.getUserEvents(this.props.userUid);
  }
  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  };

  render() {
    const {
      profile,
      photos,
      auth,
      userUid,
      requesting,
      events,
      eventLoading,
      followUser,
      unfollowUser,
      following,
      match,
      i18n
    } = this.props;
    const isCurrentUser = auth.uid === userUid;
    const loading = requesting[`users/${match.params.id}`];
    if (loading) return <LoadingComponent inverted={true} />;
    const isFollowing = !isEmpty(following);
    return (
      <Grid>
        <Grid.Column width={16}>
          <UserDetailedHeader profile={profile} i18n={i18n} />
        </Grid.Column>
        <Grid.Column width={12}>
          <UserDetailedDescription profile={profile} i18n={i18n} />
        </Grid.Column>
        <UserDetailedSidebar
          isCurrentUser={isCurrentUser}
          followUser={followUser}
          profile={profile}
          isFollowing={isFollowing}
          unfollowUser={unfollowUser}
          i18n={i18n}
        />
        {photos && photos.length > 0 ? (
          <Grid.Column width={12}>
            <UserDetailedPhotos photos={photos} auth={auth} i18n={i18n} />
          </Grid.Column>
        ) : (
          ''
        )}
        <UserDetailedEvents events={events} eventLoading={eventLoading} changeTab={this.changeTab} i18n={i18n} />
      </Grid>
    );
  }
}

export default compose(
  withI18n(),
  connect(
    mapState,
    actions
  ),
  firestoreConnect((auth, userUid, match) => userDetailedQuery(auth, userUid, match))
)(UserDetailedPage);
