import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAaqmQg1Ky6rPegvB8KZ_i5wU8y-7UgTFQ',
  authDomain: 'revents-214613.firebaseapp.com',
  databaseURL: 'https://revents-214613.firebaseio.com',
  projectId: 'revents-214613',
  storageBucket: 'revents-214613.appspot.com',
  messagingSenderId: '805004423056'
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
firestore.settings(settings);

export default firebase;
