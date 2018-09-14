import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Loader } from 'semantic-ui-react';
import { firestoreConnect } from 'react-redux-firebase';
import EventList from '../EventList/EventList';
import EventActivity from '../EventActivity/EventActivity';
import { getEventsForDashboard } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const mapState = state => ({
  events: state.events,
  loading: state.async.loading
});

const actions = {
  getEventsForDashboard
};

class EventDashboard extends Component {
  state = {
    moreEvents: false,
    initialLoading: true,
    loadedEvents: []
  };

  async componentDidMount() {
    let next = await this.props.getEventsForDashboard();
    console.log(next);
    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        initialLoading: false
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.events !== nextProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
      });
    }
  }
  getNextEvents = async () => {
    const { events, getEventsForDashboard } = this.props;
    const lastEvent = events && events[events.length - 1];
    let next = await getEventsForDashboard(lastEvent);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false
      });
    }
  };
  handleDeleteEvent = eventID => () => {
    // const updatedEvent = this.state.events.filter(eve => eve.id !== eventID);
    // this.setState({
    //   events: updatedEvent
    // });
    this.props.deleteEvent(eventID);
  };
  render() {
    const { loading } = this.props;
    const { moreEvents, loadedEvents } = this.state;
    if (this.state.initialLoading) {
      return <LoadingComponent inverted={true} />;
    }
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            moreEvents={moreEvents}
            events={loadedEvents}
            loading={loading}
            getNextEvents={this.getNextEvents}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    );
  }
}
export default connect(
  mapState,
  actions
)(firestoreConnect([{ collection: 'events' }])(EventDashboard));
