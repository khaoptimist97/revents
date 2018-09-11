import moment from 'moment';
import cuid from 'cuid';
import { toastr } from 'react-redux-toastr';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';

export const updateProfile = user => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const { isLoaded, isEmpty, ...updateUser } = user;
  if (updateUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
    updateUser.dateOfBirth = moment(updateUser.dateOfBirth).toDate();
  }
  try {
    await firebase.updateProfile(updateUser);
    toastr.success('Success', 'Profile Updated');
  } catch (error) {
    console.log(error);
  }
};

export const updateProfileImage = (file, fileName) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const imageName = cuid();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName
  };
  try {
    dispatch(asyncActionStart());
    //upload the file to firebase Storage
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    // get URL of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
    // get user doc
    let userDoc = await firestore.get(`users/${user.uid}`);
    // check if user has photo, if not update profile with new image
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL
      });
      await user.updateProfile({
        photoURL: downloadURL
      });
    }
    // add the new photo to photos collection
    await firestore.add(
      {
        collection: 'users',
        doc: user.uid,
        subcollections: [{ collection: 'photos' }]
      },
      {
        name: imageName,
        url: downloadURL
      }
    );
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error('Problem uploading photo');
  }
};

export const deletePhoto = photo => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: 'users',
      doc: user.uid,
      subcollections: [{ collection: 'photos', doc: photo.id }]
    });
  } catch (error) {
    console.log(error);
    throw new Error('Problem deleting the photo');
  }
};
export const setMainPhoto = photo => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const firebase = getFirebase();

  try {
    await firebase.updateProfile({
      photoURL: photo.url
    });
  } catch (error) {
    console.log(error);
    throw new Error('Problem setting main photo');
  }
};
export const goingToEvent = event => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  const photoURL = getState().firebase.profile.photoURL;
  const attendee = {
    displayName: user.displayName,
    going: true,
    joinDate: Date.now(),
    photoURL: photoURL || '/assets/user.png',
    host: false
  };
  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: attendee
    });
    await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
      eventId: event.id,
      userUid: user.uid,
      eventDate: event.date,
      host: false
    });
    toastr.success('Success!', 'Signing up to event successfully');
  } catch (error) {
    console.log(error);
    toastr.error('Oops!', 'Problem signing up to event ');
  }
};
export const cancelGoingToEvent = event => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  try {
    // How to delete individual field in firestore
    // Delete Object of attendees
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    });
    // Remove document
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    toastr.success('Success!', 'Thank you');
  } catch (error) {
    console.log(error);
    toastr.error('Oops!', 'Something went wrong! ');
  }
};
