import React from 'react';
import { Segment, Grid, Header, List, Icon, Item } from 'semantic-ui-react';
import format from 'date-fns/format';

const UserDetailedDescription = ({ profile }) => {
  return (
    <Segment>
      <Grid columns={2}>
        <Grid.Column width={10}>
          <Header icon="smile" content={`About ${profile.displayName}`} />
          <p>
            I am a: <strong>{profile.occupation || 'unknown occupation'}</strong>
          </p>
          <p>
            Originally from <strong>{profile.origin || 'unknown'}</strong>
          </p>
          <p>
            Member Since:
            <strong>{profile.createdAt && (format(profile.createdAt.toDate(), 'Do MMMM YYYY') || 'unknown')}</strong>
          </p>
          <p>Description of user</p>
        </Grid.Column>
        <Grid.Column width={6}>
          <Header icon="heart outline" content="Interests" />

          <List>
            {(profile.interests &&
              profile.interests.map((interest, index) => (
                <Item key={index}>
                  <Icon name="heart" />
                  <Item.Content>{interest}</Item.Content>
                </Item>
              ))) ||
              'No interest'}
          </List>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default UserDetailedDescription;
