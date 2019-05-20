// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';
// import './index.css';
//
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();


import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import * as firebase from 'firebase';
// import registerServiceWorker from './registerServiceWorker';
import './index.css';

// registerServiceWorker.register
//   .then(registration => {
//     console.log('muh registration: ', registration);
//     // messaging.useServiceWorker(registration);
//   });

const config = {
  apiKey: "AIzaSyAgvoGPD9Rh1p1Pf0TxHTdPGunB_KR9OqQ",
  authDomain: "chat-asdf.firebaseapp.com",
  databaseURL: "https://chat-asdf.firebaseio.com",
  projectId: "chat-asdf",
  storageBucket: "chat-asdf.appspot.com",
  messagingSenderId: "145747598382"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
    messaging.useServiceWorker(registration);
    requestPermission();
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
}

function requestPermission() {
  messaging.requestPermission()
    .then(function() {
      console.log('have permission');
      return messaging.getToken();
    })
    .then(function(token) {
      // here is where the token is sent to the server.
      console.log('message token: ', token);
    })
    .catch(function(err) {
      console.log('error occured', err);
    });
  messaging.onMessage(function(payload) {
    console.log('onMessage', payload);
  });
}

ReactDOM.render(
  <Provider store={store}>
    <App firebase={firebase} />
  </Provider>,
  document.getElementById("root")
);

// var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
