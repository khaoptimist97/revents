import React from 'react';
import { Segment, Header, Image } from 'semantic-ui-react';

const UserDetailedPhotos = ({ photos, auth }) => {
  let filterPhotos = photos.filter(photo => {
    return photo.url !== auth.photoURL;
  });
  return (
    <Segment attached>
      <Header icon="image" content="Photos" />

      <Image.Group size="small">
        {filterPhotos.map(photo => (
          <Image src={photo.url} />
        ))}
      </Image.Group>
    </Segment>
  );
};

export default UserDetailedPhotos;
