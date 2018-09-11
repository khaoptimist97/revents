import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase';
import EventList from '../EventList/EventList';
import EventActivity from '../EventActivity/EventActivity';
import { getEventsForDashboard } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const mapState = state => ({
  events: state.events,
  loading: state.async
});

const actions = {
  getEventsForDashboard
};

class EventDashboard extends Component {
  componentDidMount() {
    this.props.getEventsForDashboard();
  }
  handleDeleteEvent = eventID => () => {
    // const updatedEvent = this.state.events.filter(eve => eve.id !== eventID);
    // this.setState({
    //   events: updatedEvent
    // });
    this.props.deleteEvent(eventID);
  };
  render() {
    const { events, loading } = this.props;
    // if (loading) {
    //   return <LoadingComponent inverted={true} />;
    // }
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList deleteEvent={this.handleDeleteEvent} events={events} />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
      </Grid>
    );
  }
}
export default connect(
  mapState,
  actions
)(firestoreConnect([{ collection: 'events' }])(EventDashboard));
