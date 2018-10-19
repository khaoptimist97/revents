import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { ObjectToArray, createDataTree } from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';
import { openModal } from '../../modals/modalActions';
import { toastr } from 'react-redux-toastr';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';

const mapState = (state, ownProps) => {
  let event = {};
  let eventTrans = {};
  if (state.firestore.ordered.events_translation && state.firestore.ordered.events_translation[0]) {
    eventTrans = state.firestore.ordered.events_translation[0];
  }
  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = { ...state.firestore.ordered.events[0], description: eventTrans.description, title: eventTrans.title };
  }

  return {
    event,
    auth: state.firebase.auth,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) &&
      ObjectToArray(state.firebase.data.event_chat[ownProps.match.params.id]),
    loading: state.async.loading,
    requesting: state.firestore.status.requesting
  };
};
const actions = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal
};

class EventDetailedPage extends Component {
  state = {
    initialLoading: true
  };
  async componentDidMount() {
    const { firestore, match, i18n } = this.props;
    let event = await firestore.get(`events/${match.params.id}`);
    let eventTrans = await firestore.get(`events_translation/${match.params.id}_${this.props.activeLanguage}`);
    if (!event.exists && !eventTrans.exists) {
      this.props.history.push('/error');
      toastr.error(i18n._(t`Error`), i18n._(t`The event you are looking for is not found!`));
    }
    await firestore.setListener(`events/${match.params.id}`);
    await firestore.setListener(`events_translation/${match.params.id}_${this.props.activeLanguage}`);
    this.setState({
      initialLoading: false
    });
  }
  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }
  render() {
    const {
      openModal,
      loading,
      event,
      auth,
      goingToEvent,
      cancelGoingToEvent,
      addEventComment,
      eventChat,
      requesting,
      match
    } = this.props;
    const attendees =
      event &&
      event.attendees &&
      ObjectToArray(event.attendees).sort(function(a, b) {
        return a.joinDate - b.joinDate;
      });
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(e => e.id === auth.uid);
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    const authenticated = auth.isLoaded && !auth.isEmpty;
    const loadingEvent = requesting[`events/${match.params.id}`];

    if (loadingEvent || this.state.initialLoading) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader
            event={event}
            isHost={isHost}
            isGoing={isGoing}
            goingToEvent={goingToEvent}
            loading={loading}
            authenticated={authenticated}
            openModal={openModal}
            cancelGoingToEvent={cancelGoingToEvent}
            i18n={this.props.i18n}
            activeLanguage={this.props.activeLanguage}
          />
          <EventDetailedInfo event={event} i18n={this.props.i18n} />
          {authenticated && (
            <EventDetailedChat eventChat={chatTree} addEventComment={addEventComment} eventId={event.id} />
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees} i18n={this.props.i18n} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  withI18n(),
  withFirestore,
  connect(
    mapState,
    actions
  ),
  firebaseConnect(props => props.auth.isLoaded && !props.auth.isEmpty && [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
