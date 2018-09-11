import React from 'react';
import { Segment, Header, Image } from 'semantic-ui-react';
import LazyLoad from 'react-lazyload';

const UserDetailedPhotos = ({ photos, auth }) => {
  let filterPhotos = photos.filter(photo => {
    return photo.url !== auth.photoURL;
  });
  return (
    <Segment attached>
      <Header icon="image" content="Photos" />

      <Image.Group size="small">
        {filterPhotos.map(photo => (
          <LazyLoad key={photo.id} placeholder={<Image src="/assets/user.png" />} height={150} offset={-150}>
            <Image src={photo.url} />
          </LazyLoad>
        ))}
      </Image.Group>
    </Segment>
  );
};

export default UserDetailedPhotos;
