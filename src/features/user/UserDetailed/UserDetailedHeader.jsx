import React from 'react';
import { Segment, Item, Header } from 'semantic-ui-react';
import differenceInYears from 'date-fns/difference_in_years';
import { t } from '@lingui/macro';

const UserDetailedHeader = ({ profile, i18n }) => {
  let age;
  if (profile.dateOfBirth) {
    age = differenceInYears(Date.now(), profile.dateOfBirth.toDate());
  } else {
    age = `${i18n._(t`unknown`)} ${i18n._(t`age`)}`;
  }
  return (
    <Segment>
      <Item.Group>
        <Item>
          <Item.Image avatar size="small" src={profile.photoURL || '/assets/user.png'} />
          <Item.Content verticalAlign="bottom">
            <Header as="h1">{profile.displayName}</Header>
            <br />
            <Header as="h3">{profile.occupation || `${i18n._(t`unknown`)} ${i18n._(t`occupation`)}`}</Header>
            <br />
            <Header as="h3">
              {age}, {i18n._(t`Lives in`)} {profile.city || `${i18n._(t`unknown`)} ${i18n._(t`city`)}`}
            </Header>
          </Item.Content>
        </Item>
      </Item.Group>
    </Segment>
  );
};

export default UserDetailedHeader;
