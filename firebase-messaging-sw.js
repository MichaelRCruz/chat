// importScripts('https://www.gstatic.com/firebasejs/3.4.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/3.4.0/firebase-messaging.js');
//
// const config = {
//   apiKey: "AIzaSyAgvoGPD9Rh1p1Pf0TxHTdPGunB_KR9OqQ",
//   authDomain: "chat-asdf.firebaseapp.com",
//   databaseURL: "https://chat-asdf.firebaseio.com",
//   projectId: "chat-asdf",
//   storageBucket: "chat-asdf.appspot.com",
//   messagingSenderId: "145747598382"
// };
// firebase.initializeApp(config);
//
// const messaging = firebase.messaging();
//
// messaging.setBackgroundMessageHandler(function(payload) {
//   const title = 'Hello, world.';
//   const options = {
//     body: payload.data.status
//   }
//   return self.registration.showNotification(title, options);
// });
//

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};
import * as firebase from 'firebase';
firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
});
self.addEventListener('notificationclick', function(event) {
  console.log('wkejlfw');
  // do what you want
  // ...
});
