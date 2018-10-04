import React, { Component } from 'react';
import { Segment, Grid, Icon, Button } from 'semantic-ui-react';
import EventDetailedMap from './EventDetailedMap';
import format from 'date-fns/format';
import { t } from '@lingui/macro';

class EventDetailedInfo extends Component {
  state = {
    showMap: false
  };
  componentWillUnmount() {
    this.setState({
      showMap: false
    });
  }
  showMapToggle = () => {
    this.setState(prevState => ({
      showMap: !prevState.showMap
    }));
  };
  render() {
    const { event, i18n } = this.props;
    let eventDate;
    if (event.date) {
      eventDate = event.date.toDate();
    }
    return (
      <Segment.Group>
        <Segment attached="top">
          <Grid>
            <Grid.Column width={1}>
              <Icon size="large" color="teal" name="info" />
            </Grid.Column>
            <Grid.Column width={15}>
              <p>{event.description}</p>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="calendar" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={15}>
              <span>
                {format(eventDate, 'dddd Do MM')} at {format(eventDate, 'h:mm A')}
              </span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="marker" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={11}>
              <span>{event.venue}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                onClick={this.showMapToggle}
                color="teal"
                size="tiny"
                content={this.state.showMap ? i18n._(t`Hide map`) : i18n._(t`Show map`)}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        {this.state.showMap && <EventDetailedMap lat={event.venueLatLng.lat} lng={event.venueLatLng.lng} />}
      </Segment.Group>
    );
  }
}

export default EventDetailedInfo;
