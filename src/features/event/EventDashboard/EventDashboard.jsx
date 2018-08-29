import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { deleteEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const mapState = state => ({
  events: state.events,
  loading: state.async.loading
});

const actions = {
  deleteEvent
};

class EventDashboard extends Component {
  // handleFormOpen = () => {
  //   this.setState({
  //     selectedEvent: null,
  //     isOpen: true
  //   });
  // };
  // handleCancel = () => {
  //   this.setState({
  //     isOpen: false
  //   });
  // };
  // handleCreateEvent = newEvent => {
  //   newEvent.id = cuid();
  //   newEvent.hostPhotoURL = '/assets/user.png';
  //   this.props.createEvent(newEvent);
  //   this.setState({
  //     isOpen: false
  //   });
  // };
  // handleSelectedEvent = eventToOpen => () => {
  //   this.setState({
  //     selectedEvent: eventToOpen,
  //     isOpen: true
  //   });
  // };
  // handleUpdateEvent = updatedEvent => {
  //   this.props.updateEvent(updatedEvent);
  //   this.setState({
  //     events: this.state.events.map(evt => {
  //       if (evt.id === updatedEvent.id) {
  //         return Object.assign({}, updatedEvent); //Dung de copy data updatedEvent va gan cho phan tu dc replace.
  //         // Boi vi ko muon mutate state
  //       } else {
  //         return evt;
  //       }
  //     }),
  //     isOpen: false,
  //     selectedEvent: null
  //   });
  // };
  handleDeleteEvent = eventID => () => {
    // const updatedEvent = this.state.events.filter(eve => eve.id !== eventID);
    // this.setState({
    //   events: updatedEvent
    // });
    this.props.deleteEvent(eventID);
  };
  render() {
    const { events, loading } = this.props;
    if (loading) return <LoadingComponent inverted={true} />;
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList deleteEvent={this.handleDeleteEvent} events={events} />
        </Grid.Column>
        <Grid.Column width={6} />
      </Grid>
    );
  }
}
export default connect(
  mapState,
  actions
)(EventDashboard);
