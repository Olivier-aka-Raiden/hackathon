/**
 * User Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { AsyncStorage } from 'react-native';
import { Firebase, FirebaseRef } from '@constants/';
import * as ChallengeActions from '../challenges/actions';

/**
  * Get Login Credentials from AsyncStorage
  */
async function getCredentialsFromStorage() {
  const values = await AsyncStorage.getItem('api/credentials');
  const jsonValues = JSON.parse(values);

  // Return credentials from storage, or an empty object
  if (jsonValues.email || jsonValues.password) return jsonValues;
  return {};
}

/**
  * Save Login Credentials to AsyncStorage
  */
async function saveCredentialsToStorage(email = '', password = '') {
  await AsyncStorage.setItem('api/credentials', JSON.stringify({ email, password }));
}

/**
  * Remove Login Credentials from AsyncStorage
  */
async function removeCredentialsFromStorage() {
  await AsyncStorage.removeItem('api/credentials');
}

/**
  * Get this User's Details
  */
function getUserData(dispatch) {
  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const ref = FirebaseRef.child(`users/${UID}`);

  return ref.on('value', (snapshot) => {
    const userData = snapshot.val() || [];

    return dispatch({
      type: 'USER_DETAILS_UPDATE',
      data: userData,
    });
  });
}

/**
  * Login to Firebase with Email/Password
  */
export function login(formData = {}, verifyEmail = false) {
  // Reassign variables for eslint ;)
  let email = formData.Email || '';
  let password = formData.Password || '';

  return async (dispatch) => {
    // When no credentials passed in, check AsyncStorage for existing details
    if (!email || !password) {
      const credsFromStorage = await getCredentialsFromStorage();
      if (!email) email = credsFromStorage.email;
      if (!password) password = credsFromStorage.password;
    }

    // Update Login Creds in AsyncStorage
    if (email && password) saveCredentialsToStorage(email, password);

    // We're ready - let's try logging them in
    return Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        if (res && res.uid) {
          // Update last logged in data
          FirebaseRef.child(`users/${res.uid}`).update({
            lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
          });

          // Send verification Email - usually used on first login
          if (verifyEmail) {
            Firebase.auth().currentUser
              .sendEmailVerification()
              .catch(() => console.log('Verification email failed to send'));
          }

          // Get Favourites
          ChallengeActions.getFavourites(dispatch);

          // Get User Data
          getUserData(dispatch);
        }

        // Send to Redux
        return dispatch({
          type: 'USER_LOGIN',
          data: res,
        });
      }).catch((err) => { throw err; });
  };
}

/**
  * Sign Up Facebook to Firebase
  */
export function signUpWithFb(formData = {}) {
  const email = formData.Email || '';
  const password = formData.Password || '';
  const firstName = formData.FirstName || '';
  const lastName = formData.LastName || '';
  const nickname = formData.Nickname || '';
  const id = formData.Id || '';

  return () => Firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
      // Setup/Send Details to Firebase database
      if (res && res.uid) {
        FirebaseRef.child(`users/${res.uid}`).set({
          firstName,
          lastName,
          id,
          nickname,
          signedUp: Firebase.database.ServerValue.TIMESTAMP,
          lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
        });
      }
    });
}

/**
  * Sign Up to Firebase
  */
export function signUp(formData = {}) {
  const email = formData.Email || '';
  const password = formData.Password || '';
  const firstName = formData.FirstName || '';
  const lastName = formData.LastName || '';
  const nickname = formData.FirstName + ' ' + formData.LastName;

  return () => Firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
      // Setup/Send Details to Firebase database
      if (res && res.uid) {
        FirebaseRef.child(`users/${res.uid}`).set({
          firstName,
          lastName,
          nickName,
          signedUp: Firebase.database.ServerValue.TIMESTAMP,
          lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
        });
      }
    });
}

/**
  * Reset Password
  */
export function resetPassword(formData = {}) {
  const email = formData.Email || '';
  return () => Firebase.auth().sendPasswordResetEmail(email);
}

/**
  * Update Profile
  */
export function updateProfile(formData = {}) {
  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const email = formData.Email || '';
  const firstName = formData.FirstName || '';
  const lastName = formData.LastName || '';

  // Set the email against user account
  return () => Firebase.auth().currentUser
    .updateEmail(email)
      .then(() => {
        // Then update user in DB
        FirebaseRef.child(`users/${UID}`).update({
          firstName, lastName,
        });
      });
}

/**
  * Logout
  */
export function logout() {
  return dispatch => Firebase.auth()
    .signOut()
    .then(() => {
      removeCredentialsFromStorage();
      ChallengeActions.resetFavourites(dispatch);
      dispatch({ type: 'USER_LOGOUT' });
    });
}
