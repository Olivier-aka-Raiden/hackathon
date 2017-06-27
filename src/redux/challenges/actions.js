/**
 * challenge Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { Firebase, FirebaseRef } from '@constants/';

/**
  * Get this User's Favourite challenges
  */
export function getFavourites(dispatch) {
  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const ref = FirebaseRef.child(`favourites/${UID}`);

  return ref.on('value', (snapshot) => {
    const favs = snapshot.val() || [];

    return dispatch({
      type: 'FAVOURITES_REPLACE',
      data: favs,
    });
  });
}

/**
  * Reset a User's Favourite challenges in Redux (eg for logou)
  */
export function resetFavourites(dispatch) {
  return dispatch({
    type: 'FAVOURITES_REPLACE',
    data: [],
  });
}

/**
  * Update My Favourites Challenges
  */
export function replaceFavourites(newFavourites) {
  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  return () => FirebaseRef.child(`favourites/${UID}`).set(newFavourites);
}

/**
  * Get challenges
  */
export function getChallengeTypes() {
  return (dispatch) => {
    return new Firebase.Promise((resolve) => {
      const ref = FirebaseRef.child('challengeTypes');

      return ref.once('value').then((snapshot) => {
        const challengeTypes = snapshot.val() || {};

        return resolve(dispatch({
          type: 'CHALLENGE_TYPES_REPLACE',
          data: challengeTypes,
        }));
      });
    });
  };
}

/**
  * Get Challenge List
  */
export function getChallengeList() {
  return (dispatch) => {
    return new Firebase.Promise((resolve) => {
      const ref = FirebaseRef.child('challengeList');
      return ref.on('value', (snapshot) => {
        const challengeList = snapshot.val() || {};
        return resolve(dispatch({
          type: 'CHALLENGE_LIST_REPLACE',
          data: challengeList,
        }));
      });
    });
  };
}
