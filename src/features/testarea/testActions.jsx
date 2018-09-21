import { INCREMENT_COUNTER, DECREMENT_COUNTER, COUNTER_ACTION_STARTED, COUNTER_ACTION_FINISHED } from './testConstants';
import firebase from '../../app/config/firebase';

export const incrementCounter = () => {
  return {
    type: INCREMENT_COUNTER
  };
};

export const decrementCounter = () => {
  return {
    type: DECREMENT_COUNTER
  };
};

export const startCountAction = () => {
  return {
    type: COUNTER_ACTION_STARTED
  };
};

export const finishCountAction = () => {
  return {
    type: COUNTER_ACTION_FINISHED
  };
};

const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const incrementAsync = () => {
  return async dispatch => {
    dispatch(startCountAction());
    await delay(1000);
    dispatch({ type: INCREMENT_COUNTER });
    dispatch(finishCountAction());
  };
};

export const decrementAsync = () => {
  return async dispatch => {
    dispatch(startCountAction());
    await delay(1000);
    dispatch({ type: DECREMENT_COUNTER });
    dispatch(finishCountAction());
  };
};

export const testPermission = () => async (dispatch, getState) => {
  const firestore = firebase.firestore();
  try {
    let userDocRef = await firestore.collection('users').doc('x4dZzNmhl1aaxfBSS7y1tU0AzcJ2');
    await userDocRef.update({
      displayName: 'testing'
    });
  } catch (err) {
    console.log(err);
  }
};
