import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Loader } from 'semantic-ui-react';
import { firestoreConnect } from 'react-redux-firebase';
import EventList from '../EventList/EventList';
import EventActivity from '../EventActivity/EventActivity';
import { getEventsForDashboard } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const query = [
  {
    collection: 'activity',
    orderBy: ['timestamp', 'desc'],
    limit: 5
  }
];
const mapState = state => ({
  events: state.events,
  loading: state.async.loading,
  activities: state.firestore.ordered.activity
});

const actions = {
  getEventsForDashboard
};

class EventDashboard extends Component {
  state = {
    moreEvents: false,
    initialLoading: true,
    loadedEvents: [],
    contextRef: {}
  };

  async componentDidMount() {
    let next = await this.props.getEventsForDashboard(null, this.props.activeLanguage);
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
    let next = await getEventsForDashboard(lastEvent, this.props.activeLanguage);
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
  handleContextRef = contextRef => this.setState({ contextRef });
  render() {
    const { loading, activities } = this.props;
    const { moreEvents, loadedEvents } = this.state;
    if (this.state.initialLoading) {
      return <LoadingComponent inverted={true} />;
    }
    return (
      <Grid>
        <Grid.Column width={10}>
          {/* ref allow us to access div HTML element that Sticky will use to hook ontos */}
          <div ref={this.handleContextRef}>
            <EventList
              moreEvents={moreEvents}
              events={loadedEvents}
              loading={loading}
              getNextEvents={this.getNextEvents}
              activeLanguage={this.props.activeLanguage}
            />
          </div>
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity activities={activities} contextRef={this.state.contextRef} />
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
)(firestoreConnect(query)(EventDashboard));
