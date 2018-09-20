const functions = require('firebase-functions');
// Log in admin to get full rights
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
//
admin.firestore().settings({ timestampsInSnapshots: true });
// Activity
const newActivity = (type, event, id) => {
  return {
    type: type,
    eventDate: event.date,
    hostedBy: event.hostedBy,
    title: event.title,
    photoURL: event.hostPhotoURL,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    hostUid: event.hostUid,
    eventId: id
  };
};
exports.createActivity = functions.firestore.document('events/{eventId}').onCreate(event => {
  let newEvent = event.data();

  console.log(newEvent);

  const activity = newActivity('newEvent', newEvent, event.id);

  console.log(activity);

  return admin
    .firestore()
    .collection('activity')
    .add(activity)
    .then(docRef => {
      return console.log('Activity created with ID: ', docRef.id);
    })
    .catch(err => {
      return console.log('Error adding activity', err);
    });
});
exports.cancelActivity = functions.firestore.document('events/{eventId}').onUpdate((event, context) => {
  let updatedEvent = event.after.data();
  let previousEventData = event.before.data();
  console.log({ event });
  console.log({ context });
  console.log({ updatedEvent });
  console.log({ previousEventData });

  if (!updatedEvent.cancelled || updatedEvent.cancelled === previousEventData.cancelled) return false;

  const activity = newActivity('cancelledEvent', updatedEvent, context.params.eventId);

  console.log({ activity });
  return admin
    .firestore()
    .collection('activity')
    .add(activity)
    .then(docRef => {
      return console.log('Activity created with ID: ', docRef.id);
    })
    .catch(err => {
      return console.log('Error adding activity', err);
    });
});
exports.userFollowing = functions.firestore
  .document('users/{followerId}/following/{followingId}')
  .onCreate((event, context) => {
    console.log('v1');
    const followerId = context.params.followerId;
    const followingId = context.params.followingId;
    const followDoc = admin
      .firestore()
      .collection('users')
      .doc(followerId);

    console.log(followDoc);
    return followDoc.get().then(doc => {
      console.log({ doc });
      let userData = doc.data();
      console.log({ userData });
      let follower = {
        displayName: userData.displayName,
        photoURL: userData.photoURL || '/assets/user.png',
        city: userData.city || 'unknown city'
      };

      return admin
        .firestore()
        .collection('users')
        .doc(followingId)
        .collection('followers')
        .doc(followerId)
        .set(follower);
    });
  });
exports.unfollowUser = functions.firestore
  .document('users/{followerId}/following/{followingId}')
  .onDelete((event, context) => {
    return admin
      .firestore()
      .collection('users')
      .doc(context.params.followingId)
      .collection('followers')
      .doc(context.params.followerId)
      .delete()
      .then(() => {
        return console.log('doc deleted');
      })
      .catch(err => {
        return console.log(err);
      });
  });
