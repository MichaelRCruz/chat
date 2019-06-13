import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

// Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  var email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  // firebase.auth().signInWithEmailLink(email, window.location.href)
  //   .then(function(result) {
  //     // Clear email from storage.
  //     window.localStorage.removeItem('emailForSignIn');
  //     // You can access the new user via result.user
  //     // Additional user info profile not available via:
  //     // result.additionalUserInfo.profile == null
  //     // You can check if the user is new or existing:
  //     // result.additionalUserInfo.isNewUser
  //   })
  //   .catch(function(error) {
  //     // Some error occurred, you can inspect the code: error.code
  //     // Common errors could be invalid email and invalid or expired OTPs.
  //   });
}

if (('serviceWorker' in navigator) && firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
  navigator.serviceWorker.register('firebase-messaging-sw.js')
  .then(function(registration) {
    messaging.useServiceWorker(registration);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
  messaging.onMessage(function(payload) {
    console.log('onMessage', payload);
  });
};

ReactDOM.render(<App firebase={firebase} />, document.getElementById("root"));
