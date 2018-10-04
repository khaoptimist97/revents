import React from 'react';
import { Segment, Image, Item, Header, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { t } from '@lingui/macro';

const eventImageStyle = {
  filter: 'brightness(30%)'
};

const eventImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};
const EventDetailedHeader = ({
  event,
  isHost,
  isGoing,
  goingToEvent,
  cancelGoingToEvent,
  loading,
  authenticated,
  openModal,
  i18n
}) => {
  let eventDate;
  if (event.date) {
    eventDate = event.date.toDate();
  }
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: '0' }}>
        <Image src={`/assets/categoryImages/${event.category}.jpg`} fluid style={eventImageStyle} />

        <Segment basic style={eventImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size="huge" content={event.title} style={{ color: 'white' }} />
                <p>{format(eventDate, 'dddd Do MMMM')}</p>
                <p>
                  {i18n._(t`Hosted by`)}{' '}
                  <strong>{event.attendees && Object.values(event.attendees)[0].displayName}</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom">
        {!isHost && (
          <div>
            {isGoing &&
              !event.cancelled && (
                <Button onClick={() => cancelGoingToEvent(event)}>{i18n._(t`Cancel My Place`)}</Button>
              )}
            {!isGoing &&
              !event.cancelled &&
              authenticated && (
                <Button loading={loading} onClick={() => goingToEvent(event)} color="teal">
                  {i18n._(t`JOIN THIS EVENT`)}
                </Button>
              )}
            {!authenticated &&
              !event.cancelled && (
                <Button loading={loading} onClick={() => openModal('UnAuthModal')} color="teal">
                  JOIN THIS EVENT
                </Button>
              )}
          </div>
        )}
        {isHost && (
          <Button as={Link} to={`/manage/${event.id}`} color="orange">
            {i18n._(t`Manage Event`)}
          </Button>
        )}
        {event.cancelled &&
          !isHost && <Label size="large" color="red" content={i18n._(t`This event has been cancelled`)} />}
      </Segment>
    </Segment.Group>
  );
};

export default EventDetailedHeader;
