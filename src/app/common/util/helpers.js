import moment from 'moment';

export const ObjectToArray = object => {
  if (object) {
    //return an array including key-value pairs, its format: ["key", {}] 1 mang chua key dang string, va value dang object
    // [["key", {value}], ["key", {value}],...]
    let array = Object.entries(object);
    // Return 1 array cac object [{}, {}, {}, ...]
    let mapArray = array.map(e => Object.assign(e[1], { id: e[0] }));

    // console.log(array);
    // console.log(mapArray);
    return mapArray;
  }
};

export const createNewEvent = (user, photoURL, event) => {
  event.date = moment(event.date).toDate();
  return {
    ...event,
    hostUid: user.uid,
    hostPhotoURL: photoURL || '/assets/user.png',
    created: Date.now(),
    attendees: {
      [user.uid]: {
        going: true,
        joinDate: Date.now(),
        photoURL: photoURL || '/assets/user.png',
        displayName: user.displayName,
        host: true
      }
    }
  };
};
export const createDataTree = dataset => {
  let hashTable = Object.create(null);
  dataset.forEach(a => (hashTable[a.id] = { ...a, childNodes: [] }));
  let dataTree = [];
  dataset.forEach(a => {
    if (a.parentId) hashTable[a.parentId].childNodes.push(hashTable[a.id]);
    else dataTree.push(hashTable[a.id]);
  });
  return dataTree;
};
