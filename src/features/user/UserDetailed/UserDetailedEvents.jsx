import React from 'react';
import { Card, Grid, Header, Image, Segment, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';

const panes = [
  { menuItem: 'All Events', pane: { key: 'allEvents' } },
  { menuItem: 'Past Events', pane: { key: 'pastEvents' } },
  { menuItem: 'Future Events', pane: { key: 'futureEvents' } },
  { menuItem: 'Hosting', pane: { key: 'hosted' } }
];
const UserDetailedEvents = ({ events, eventLoading, changeTab }) => {
  return (
    <Grid.Column width={12}>
      <Segment attached loading={eventLoading}>
        <Header icon="calendar" content="Events" />

        <Tab onTabChange={(e, data) => changeTab(e, data)} panes={panes} menu={{ secondary: true, pointing: true }} />

        <Card.Group itemsPerRow={5}>
          {events &&
            events.map(evt => (
              <Card as={Link} to={`/event/${evt.id}`} key={evt.id}>
                <Image src={`/assets/categoryImages/${evt.category}.jpg`} />
                <Card.Content>
                  <Card.Header textAlign="center">${evt.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>
                      {format(evt.date && evt.date.toDate(), 'DD MMM YYYY')}
                      {format(evt.date && evt.date.toDate(), 'h:mm A')}
                    </div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
        </Card.Group>
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedEvents;
