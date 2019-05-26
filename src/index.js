import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import * as firebase from 'firebase';
import './index.css';

console.log('0.013');

const config = {
  apiKey: "AIzaSyAgvoGPD9Rh1p1Pf0TxHTdPGunB_KR9OqQ",
  authDomain: "chat-asdf.firebaseapp.com",
  databaseURL: "https://chat-asdf.firebaseio.com",
  projectId: "chat-asdf",
  storageBucket: "chat-asdf.appspot.com",
  messagingSenderId: "145747598382"
};
firebase.initializeApp(config);

if (('serviceWorker' in navigator) && firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
  navigator.serviceWorker.register('firebase-messaging-sw.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
    messaging.useServiceWorker(registration);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
  messaging.onMessage(function(payload) {
    console.log('onMessage', payload);
  });
}

ReactDOM.render(
  <Provider store={store}>
    <App firebase={firebase}
    />
  </Provider>,
  document.getElementById("root")
);
