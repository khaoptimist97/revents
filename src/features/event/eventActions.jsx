import { toastr } from 'react-redux-toastr';
import { FETCH_EVENTS } from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';
import firebase from '../../app/config/firebase';
import compareAsc from 'date-fns/compare_asc';

export const createEvent = event => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    let newEvent = createNewEvent(user, photoURL, event);
    try {
      let createdEvent = await firestore.add('events', {
        attendees: newEvent.attendees,
        category: newEvent.category,
        city: newEvent.city,
        created: newEvent.created,
        date: newEvent.date,
        hostPhotoURL: newEvent.hostPhotoURL,
        hostUid: newEvent.hostUid,
        hostedBy: newEvent.hostedBy,
        venue: newEvent.venue,
        venueLatLng: newEvent.venueLatLng
      });
      await firestore.set(`events_translation/${createdEvent.id}_en`, {
        description: newEvent.description,
        title: newEvent.title,
        events_non_trans_id: createdEvent.id
      });
      await firestore.set(`events_translation/${createdEvent.id}_vi`, {
        description: newEvent.description,
        title: newEvent.title,
        events_non_trans_id: createdEvent.id
      });
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      toastr.success('Success!', 'Event has been created');
    } catch (error) {
      toastr.error('Oops! Something went wrong');
      console.log(error.message);
    }
  };
};
export const updateEvent = event => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());
    const firestore = firebase.firestore();
    if (event.date !== getState().firestore.ordered.events[0].date) {
      event.date = moment(event.date).toDate();
    }

    try {
      let eventDocRef = await firestore.collection('events').doc(event.id);
      let dateEqual = compareAsc(getState().firestore.ordered.events[0].date.toDate(), event.date);
      if (dateEqual !== 0) {
        let batch = firestore.batch();
        await batch.update(eventDocRef, event);

        let eventAttendeeRef = firestore.collection('event_attendee');
        let eventAttendeeQuery = await eventAttendeeRef.where('eventId', '==', event.id);
        let eventAttendeeQuerySnap = await eventAttendeeQuery.get();

        for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
          let eventAttendeeDocRef = eventAttendeeRef.doc(eventAttendeeQuerySnap.docs[i].id);
          await batch.update(eventAttendeeDocRef, {
            eventDate: event.date
          });
        }
        await batch.commit();
      } else {
        await eventDocRef.update(event);
      }
      dispatch(asyncActionFinish());
      toastr.success('Success!', 'Event has been updated');
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
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

export const getEventsForDashboard = (lastEvent, activeLanguage) => async (dispatch, getState) => {
  let today = new Date(Date.now());
  const firestore = firebase.firestore();
  const queryRef = firestore.collection('events');
  const transQueryRef = firestore.collection('events_translation');
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
      // Get events_translation doc
      let eventsTransSnapshot = await transQueryRef.doc(`${querySnapshot.docs[i].id}_${activeLanguage}`).get();
      let evt = {
        ...querySnapshot.docs[i].data(),
        id: querySnapshot.docs[i].id,
        description: eventsTransSnapshot.data().description,
        title: eventsTransSnapshot.data().title
      };
      events.push(evt);
    }
    console.log(events);
    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
    // Return de su dung thong tin length cua querySnapshot tren UI
    return querySnapshot;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};
export const addEventComment = (evenId, values, parentId) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  const newComment = {
    parentId: parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL || 'assets/user.png',
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  };
  try {
    await firebase.push(`event_chat/${evenId}`, newComment);
  } catch (error) {
    console.log(error);
    toastr.error('Oops!', 'Problem adding comment');
  }
};
