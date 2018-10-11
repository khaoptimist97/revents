import React from 'react';
import { Grid, Segment, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { t } from '@lingui/macro';

const UserDetailedSidebar = ({ isCurrentUser, followUser, profile, isFollowing, unfollowUser, i18n }) => {
  return (
    <Grid.Column width={4}>
      <Segment>
        {isCurrentUser && (
          <Button as={Link} to="/settings/basic" color="teal" fluid basic content={i18n._(t`Edit Profile`)} />
        )}
        {!isCurrentUser &&
          !isFollowing && (
            <Button onClick={() => followUser(profile)} color="teal" fluid basic content={i18n._(t`Follow User`)} />
          )}
        {!isCurrentUser &&
          isFollowing && (
            <Button onClick={() => unfollowUser(profile)} color="teal" fluid basic content={i18n._(t`Unfollow`)} />
          )}
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedSidebar;
