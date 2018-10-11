import React from 'react';
import { Segment, Header, Image } from 'semantic-ui-react';
import LazyLoad from 'react-lazyload';
import { t } from '@lingui/macro';

const UserDetailedPhotos = ({ photos, auth, i18n }) => {
  let filterPhotos = photos.filter(photo => {
    return photo.url !== auth.photoURL;
  });
  return (
    <Segment attached>
      <Header icon="image" content={i18n._(t`Photos`)} />

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
