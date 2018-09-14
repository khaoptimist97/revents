import React, { Component } from 'react';
import { Button, Grid, Segment } from 'semantic-ui-react';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { connect } from 'react-redux';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedEvents from './UserDetailedEvents';
import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents } from '../../user/userActions';

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
    requesting: state.firestore.status.requesting
  };
};
const actions = {
  getUserEvents
};

class UserDetailedPage extends Component {
  async componentDidMount() {
    await this.props.getUserEvents(this.props.userUid);
  }
  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  };
  render() {
    const { profile, photos, auth, userUid, requesting, events, eventLoading } = this.props;
    const isCurrentUser = auth.uid === userUid;
    const loading = Object.values(requesting).some(a => a === true);
    if (loading) return <LoadingComponent inverted={true} />;
    return (
      <Grid>
        <Grid.Column width={16}>
          <UserDetailedHeader profile={profile} />
        </Grid.Column>
        <Grid.Column width={12}>
          <UserDetailedDescription profile={profile} />
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment>
            {isCurrentUser ? (
              <Button as={Link} to="/settings/basic" color="teal" fluid basic content="Edit Profile" />
            ) : (
              <Button color="teal" fluid basic content="Follow User" />
            )}
          </Segment>
        </Grid.Column>

        {photos && photos.length > 0 ? (
          <Grid.Column width={12}>
            <UserDetailedPhotos photos={photos} auth={auth} />
          </Grid.Column>
        ) : (
          ''
        )}
        <UserDetailedEvents events={events} eventLoading={eventLoading} changeTab={this.changeTab} />
      </Grid>
    );
  }
}

export default compose(
  connect(
    mapState,
    actions
  ),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);
