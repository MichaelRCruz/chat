const functions = require('firebase-functions');
const fetch = require("node-fetch");
const cors = require('cors')({
  origin: true,
});

const admin = require('firebase-admin');
serviceAccount = require('./serviceAccountKey.json');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(functions.config().firebase);

// exports.helloWorld = functions.https.onRequest((req, res) => {
//   res.json({"greeting": "sup, yo"});
// });

// https://us-central1-chat-asdf.cloudfunctions.net/handleHttpRedirect
// exports.handleHttpRedirect = functions.https.onRequest((req, res) => {
//   console.log('inside handleHttpRedirect');
//   res.redirect(303, 'https://michaelcruz.io/chat');
// });
//
// exports.insertIntoDb = functions.https.onRequest((req, res) => {
//   const text = req.query.text;
//   admin.database().ref('/test').push({text: text}).then(snapshot => {
//     console.log('snapshot.ref: ', snapshot.ref);
//     res.redirect(303, snapshot.ref);
//   });
// });
//
// exports.convertToUppercase = functions.database.ref('/test/{pushId}/text')
//   .onWrite(event => {
//     const text = event.data.val();
//     const uppercaseText = text.toUpperCase();
//     console.log('text uppercaseText', text, uppercaseText);
//     return event.data.ref.parent.child('uppercaseText').set(uppercaseText);
// ;});

// https://us-central1-chat-asdf.cloudfunctions.net/flagAsActive
// exports.flagAsActive = functions.https.onRequest((req, res) => {
//   const roomId = req.query.roomId;
//   const roomRef = admin.database().ref(`/rooms/${roomId}`);
//   roomRef.update({active: true}).then(res => {
//     console.log('cloud function active: ', roomId);
//   });
//   // admin.database().ref('/test').push({text: text}).then(snapshot => {
//   //   console.log('snapshot.ref: ', snapshot.ref);
//   //   res.redirect(303, snapshot.ref);
//   // });
// });

// https://us-central1-chat-asdf.cloudfunctions.net/manageDeviceGroup
// exports.manageDeviceGroup = functions.https.onRequest((req, res) => {
//   return cors(req, res, async () => {
//     const {name, fcmToken} = JSON.parse(req.body);
//     console.log(name, fcmToken);
//     const body = JSON.stringify({
//       operation: "create",
//       notification_key_name: name,
//       registration_ids: [fcmToken]
//     });
//     const fetchResponse = await fetch('https://fcm.googleapis.com/fcm/notification', {
//       method: 'POST',
//       headers: {
//     		'Content-Type': 'application/json',
//         'Aurthorization': 'key=AIzaSyBm5JwOWxePR3MLcQZiOFZul0Rk3W95mos',
//     		'project_id': '145747598382'
//     	},
//       body
//     }).then(function(response) {
//       return response;
//     }).then(response => {
//       return response;
//     }).catch(function(error) {
//       console.log("error from fetch", error);
//       return error;
//     });
//     console.log(typeof fetchResponse, fetchResponse);
//     res.json(fetchResponse);
//   });
// });

exports.createRoomAndUserConfig = functions.auth.user().onCreate(user => {
  console.log('user: ', user)
  const roomRef = admin.database().ref('/rooms');
  const userRef = admin.database().ref('/users');
  return roomRef.child(`uid-${user.uid}`).set({
    active: false,
    creator: user.uid,
    dscription: `${user.displayName}'s first Potato. Welcome!`,
    moderators: [user.uid],
    name: `${user.displayName}'s Potato`
  }).then(res => {
    return userRef.child(user.uid).set({
      displayName: user.displayName,
      lastVisited: `uid-${user.uid}`,
      rooms: [`uid-${user.uid}`, '-Ld7mZCDqAEcMSGxJt-x']
    });
  });
});

// https://us-central1-chat-asdf.cloudfunctions.net/addTokenToTopic
exports.gitHubPushWebHook = functions.https.onRequest((req, res) => {
  const messageRef = admin.database().ref('/messages');
  const {head_commit} = req.body;
  return messageRef.push({
    content: '### repo update alert',
    sentAt: Date.now(),
    roomId: "-Ld7mZCDqAEcMSGxJt-x",
    creator: {
      uid: null,
      email: null,
      displayName: "GitHub",
      photoURL: "https://avatars3.githubusercontent.com/u/9919?s=40&v=4"
    }
  }).then(() => {
    res.end();
  });
});

// https://us-central1-chat-asdf.cloudfunctions.net/addTokenToTopic
exports.addTokenToTopic = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const {uid, fcmToken} = JSON.parse(req.body);
    const userRef = admin.database().ref(`/users/${uid}/fcmTokens`);
    admin.messaging().subscribeToTopic([fcmToken], `topic-${uid}`)
      .then(function(response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log('Successfully subscribed to topic:', response);
        return userRef.child(fcmToken).set(true).then(function() {
          return res.send(response);
        });
      })
      .catch(function(error) {
        console.log('Error subscribing to topic:', error);
        res.send(error);
      });
  });
});

// https://us-central1-chat-asdf.cloudfunctions.net/sendMessageToTopic
exports.sendMessageToTopic = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const {uid, message} = JSON.parse(req.body);
    const payloadMessage = {
      data: { message },
      topic: `topic-${uid}`
    };
    admin.messaging().send(payloadMessage)
      .then((response) => {
        console.log(response);
        res.send(response);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  });
});

// https://us-central1-chat-asdf.cloudfunctions.net/sendMessageToUser
exports.sendMessageToUser = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.set('Access-Control-Allow-Origin', '*');
    const {displayNames, message} = JSON.parse(req.body);
    const usersRef = admin.database().ref('users');
    let targetedUser = false;
    usersRef.once("value", snap => {
      let multiCastTokens = [];
      snap.forEach(user => {
        if (displayNames.includes(user.val().displayName)) {
          targetedUser = true;
          const fcmTokens = Object.keys(user.val().fcmTokens);
          multiCastTokens = multiCastTokens.concat(fcmTokens);
        }
      });
      const payload = {
        data: { title: 'Approachable is better than simple.', message}
      };
      if (targetedUser) {
        admin.messaging().sendToDevice(multiCastTokens, payload)
          .then((response) => {
            res.send(response);
          })
          .catch((error) => {
            console.log('catch from admin.messaging: ', error);
            res.send(error);
          });
      } else {
        res.send('message failed to send');
      }
    });
  });
});


// https://us-central1-chat-asdf.cloudfunctions.net/getOnlineUsers
// exports.getOnlineUsers = functions.https.onRequest((req, res) => {
//   function listAllUsers(nextPageToken) {
//     // List batch of users, 1000 at a time.
//     admin.auth().listUsers(1000, nextPageToken)
//       .then(function(listUsersResult) {
//         listUsersResult.users.forEach(function(userRecord) {
//           console.log('user', userRecord.toJSON());
//         });
//         if (listUsersResult.pageToken) {
//           // List next batch of users.
//           listAllUsers(listUsersResult.pageToken);
//         }
//       })
//       .catch(function(error) {
//         console.log('Error listing users:', error);
//       });
//   }
//   // Start listing users from the beginning, 1000 at a time.
//   listAllUsers();
// });







// exports.addTokenToTopic = functions.https.onRequest((req, res) => {
//   return cors(req, res, () => {
//     const {uid, fcmToken} = JSON.parse(req.body);
//     const userRef = admin.database().ref(`/users/${uid}/fcmTokens`);
//     admin.messaging().subscribeToTopic([fcmToken], `topic-${uid}`)
//       .then(function(response) {
//         // See the MessagingTopicManagementResponse reference documentation
//         // for the contents of response.
//         console.log('Successfully handled subscription]:', response);
//         const userRef = admin.database().ref(`/users/${uid}/fcmTokens`);
//         const transaction = admin.database().runTransaction(t => {
//           return t.get(userRef).then(doc => {
//             if (doc.data().fcmTokens) {
//               t.update(userRef, {[fcmToken]: isSubscribed});
//               return Promise.resolve('updated tokens');
//             } else {
//               return Promise.reject('did not write to db');
//             }
//           }).then(result => {
//             console.log('Transaction success', result);
//           }).catch(err => {
//             console.log('Transaction failure:', err);
//           });
//         })
//         .catch(function(error) {
//           console.log('Error subscribing to topic:', error);
//         });
//       })
//       .catch(function(error) {
//         console.log('Error subscribing to topic:', error);
//         res.send(error);
//       });
//       res.send({fcmToken});
//   });
// });
