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
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.1/firebase.js');
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('../firebase-messaging-sw.js')
//   .then(function(registration) {
//     console.log('Registration successful, scope is:', registration.scope);
//   }).catch(function(err) {
//     console.log('Service worker registration failed, error:', err);
//   });
// }
console.log('inside fms...')
firebase.initializeApp({
	// Project Settings => Add Firebase to your web app
  messagingSenderId: "145747598382"
});
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
      return registration.showNotification("new message from michaelcruz.io");
    });
  return promiseChain;
});
self.addEventListener('notificationclick', function(event) {
  // do what you want
  // ...
});
