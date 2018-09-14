import { toastr } from 'react-redux-toastr';
import { FETCH_EVENTS } from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { createNewEvent } from '../../app/common/util/helpers';
import { moment } from 'moment';
import firebase from '../../app/config/firebase';

export const createEvent = event => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    let newEvent = createNewEvent(user, photoURL, event);
    try {
      let createdEvent = await firestore.add('events', newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      toastr.success('Success!', 'Event has been created');
    } catch (error) {
      toastr.error('Oops! Something went wrong');
    }
  };
};
export const updateEvent = event => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    if (event.date !== getState().firestore.ordered.events[0].date) {
      event.date = moment(event.date).toDate();
    }
    try {
      await firestore.update(`events/${event.id}`, event);
      toastr.success('Success!', 'Event has been updated');
    } catch (error) {
      console.log(error);
      toastr.error('Oops! Something went wrong');
    }
  };
};
export const cancelToggle = (cancelled, eventId) => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const message = cancelled
    ? 'Are you sure you want to cancel the event?'
    : 'This will reactivate the event - are you sure?';
  try {
    toastr.confirm(message, {
      onOk: () =>
        firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        })
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEventsForDashboard = lastEvent => async (dispatch, getState) => {
  let today = new Date(Date.now());
  const firestore = firebase.firestore();
  const queryRef = firestore.collection('events');
  try {
    dispatch(asyncActionStart());
    // Kiem tra co lastEvent ko? Vi do la truong hop initial load, moi dau load event len page
    let startAfter = lastEvent && (await queryRef.doc(lastEvent.id).get());
    let query;
    lastEvent
      ? (query = queryRef
          .where('date', '>=', today)
          .orderBy('date')
          .startAfter(startAfter)
          .limit(2))
      : (query = query = queryRef
          .where('date', '>=', today)
          .orderBy('date')
          .limit(2));
    let querySnapshot = await query.get();
    // Dua vao querySnapshot co bao nhieu docs de xem xet co thuc hien loop ko, neu ko co docs nao thi return tai day.
    if (querySnapshot.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnapshot;
    }
    let events = [];
    for (let i = 0; i < querySnapshot.docs.length; i++) {
      let evt = { ...querySnapshot.docs[i].data(), id: querySnapshot.docs[i].id };
      events.push(evt);
    }
    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
    // Return de su dung thong tin length cua querySnapshot tren UI
    return querySnapshot;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};
