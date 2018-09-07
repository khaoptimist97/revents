import React, { Component } from 'react';
import { Button, Card, Grid, Header, Image, Menu, Segment } from 'semantic-ui-react';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';

const mapState = state => ({
  profile: state.firebase.profile,
  auth: state.firebase.auth,
  photos: state.firestore.ordered.photos
});
const query = ({ auth }) => {
  return [
    {
      collection: 'users',
      doc: auth.uid,
      subcollections: [{ collection: 'photos' }],
      storeAs: 'photos'
    }
  ];
};

class UserDetailedPage extends Component {
  render() {
    const { profile, photos, auth } = this.props;

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
            <Button color="teal" fluid basic content="Edit Profile" />
          </Segment>
        </Grid.Column>

        {photos.length > 0 ? (
          <Grid.Column width={12}>
            <UserDetailedPhotos photos={photos} auth={auth} />
          </Grid.Column>
        ) : (
          ''
        )}

        <Grid.Column width={12}>
          <Segment attached>
            <Header icon="calendar" content="Events" />
            <Menu secondary pointing>
              <Menu.Item name="All Events" active />
              <Menu.Item name="Past Events" />
              <Menu.Item name="Future Events" />
              <Menu.Item name="Events Hosted" />
            </Menu>

            <Card.Group itemsPerRow={5}>
              <Card>
                <Image src={'/assets/categoryImages/drinks.jpg'} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">28th March 2018 at 10:00 PM</Card.Meta>
                </Card.Content>
              </Card>

              <Card>
                <Image src={'/assets/categoryImages/drinks.jpg'} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">28th March 2018 at 10:00 PM</Card.Meta>
                </Card.Content>
              </Card>
            </Card.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  connect(mapState),
  firestoreConnect(auth => query(auth))
)(UserDetailedPage);
