import React from 'react';
import { Segment, Grid, Header, List, Icon, Item } from 'semantic-ui-react';
import format from 'date-fns/format';
import { t } from '@lingui/macro';

const UserDetailedDescription = ({ profile, i18n }) => {
  return (
    <Segment>
      <Grid columns={2}>
        <Grid.Column width={10}>
          <Header icon="smile" content={`${i18n._(t`About`)} ${profile.displayName}`} />
          <p>
            {i18n._(t`I am a`)}:{' '}
            <strong>{profile.occupation || `${i18n._(t`unknown`)} ${i18n._(t`occupation`)}`}</strong>
          </p>
          <p>
            {i18n._(t`Originally from`)} <strong>{profile.origin || i18n._(t`unknown`)}</strong>
          </p>
          <p>
            {i18n._(t`Member Since`)}:
            <strong>
              {profile.createdAt && (format(profile.createdAt.toDate(), 'Do MMMM YYYY') || i18n._(t`unknown`))}
            </strong>
          </p>
          <p>{i18n._(t`Description of user`)}</p>
        </Grid.Column>
        <Grid.Column width={6}>
          <Header icon="heart outline" content={i18n._(t`Interests`)} />

          <List>
            {(profile.interests &&
              profile.interests.map((interest, index) => (
                <Item key={index}>
                  <Icon name="heart" />
                  <Item.Content>{interest}</Item.Content>
                </Item>
              ))) ||
              `${i18n._(t`No`)} ${i18n._(t`Interests`)}`}
          </List>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default UserDetailedDescription;
