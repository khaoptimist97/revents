import React, { Component } from 'react';
import { Segment, Item, Icon, Button, List, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import EventListAttendee from './EventListAttendee';
import { ObjectToArray } from '../../../app/common/util/helpers';
import { Trans } from '@lingui/macro';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

class EventListItem extends Component {
  render() {
    const { event, i18n } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/event/${event.id}`}>
                  {event.title}
                </Item.Header>
                <Item.Description>
                  <Trans id="hostedBy">Hosted by </Trans> <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
                </Item.Description>

                {event.cancelled && (
                  <Label
                    style={{ top: '-40px' }}
                    ribbon="right"
                    color="red"
                    content={i18n._(t`This event has been cancelled`)}
                  />
                )}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {format(event.date.toDate(), 'dddd Do MMMM')} at{' '}
            {format(event.date.toDate(), 'HH:mm')} |<Icon name="marker" /> {event.venue}
          </span>
        </Segment>
        <Segment secondary>
          <List horizontal>
            {event.attendees &&
              ObjectToArray(event.attendees).map(attandee => (
                <EventListAttendee key={attandee.id} attendee={attandee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>

          <Button as={Link} to={`/event/${event.id}`} color="teal" floated="right" content={i18n._(t`View`)} />
        </Segment>
      </Segment.Group>
    );
  }
}
export default withI18n()(EventListItem);
