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

firebase.auth()
  .getRedirectResult()
  .then(result => {
    const user = result.user;
    const token = result.credential ? result.credential.accessToken : null;
    const isNew = result.additionalUserInfo.isNewUser;
    const email = user.email ? user.email : null;
    const providerName = user.providerName ? user.providerName : null;
    const randomString = Math.random().toString(36).substr(2, 4);
    const displayName = providerName.replace(/\s/g,'') + '_' + randomString;
    init({ email, displayName, token, isNew });
  })
  .catch(error => {
    const errorCode = error.code;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have already signed up with a different auth provider for that email.');
    }
    console.error(error);
    init({ error });
  });

// Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  const email = window.localStorage.getItem('asdfChatEmailForSignIn');
  const displayName = window.localStorage.getItem('asdfChatDisplayName');
  firebase.auth().signInWithEmailLink(email, window.location.href)
    .then(result => {
      window.localStorage.removeItem('emailForSignIn');
      window.localStorage.removeItem('displayName');
      const token = result.credential ? result.credential.accessToken : null;
      const isNew = result.additionalUserInfo.isNewUser;
      init({ email, displayName, token, isNew });
    })
    .catch(error => {
      console.error(error.code);
      init(error);
    });
};

function init(settings) {
  const initProps = Object.assign({}, settings, { firebase });
  ReactDOM.render(<App {...initProps} />, document.getElementById("root"));
};

init();
