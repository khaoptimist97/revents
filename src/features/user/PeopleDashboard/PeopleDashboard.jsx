import React from 'react';
import { Grid, Segment, Header, Card } from 'semantic-ui-react';
import PeopleCard from './PeopleCard';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';

const query = ({ auth }) => {
  return [
    {
      collection: 'users',
      doc: auth.uid,
      subcollections: [{ collection: 'followers' }],
      storeAs: 'follower'
    },
    {
      collection: 'users',
      doc: auth.uid,
      subcollections: [{ collection: 'following' }],
      storeAs: 'following'
    }
  ];
};
const mapState = state => {
  return {
    followers: state.firestore.ordered.follower,
    followings: state.firestore.ordered.following,
    auth: state.firebase.auth
  };
};
const PeopleDashboard = ({ followings }, { followers }) => {
  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment>
          <Header dividing content="People following me" />
          <Card.Group itemsPerRow={8} stackable>
            {followers && followers.map(follower => <PeopleCard key={follower.id} user={follower} />)}
          </Card.Group>
        </Segment>
        <Segment>
          <Header dividing content="People I'm following" />
          <Card.Group itemsPerRow={8} stackable>
            {followings && followings.map(following => <PeopleCard key={following.id} user={following} />)}
          </Card.Group>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default compose(
  connect(mapState),
  firestoreConnect(props => query(props))
)(PeopleDashboard);
