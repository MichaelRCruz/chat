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
    temp: 'temp test',
    active: false,
    creator: user.uid,
    dscription: `${user.displayName}'s first Potato. Welcome!`,
    moderators: [user.uid],
    name: `${user.displayName}'s Potato`
  }).then(res => {
    return userRef.child(user.uid).set({
      lastVisited: `uid-${user.uid}`,
      rooms: [`uid-${user.uid}`]
    });
  });
});

// https://us-central1-chat-asdf.cloudfunctions.net/addTokenToTopic
exports.gitHubPushWebHook = functions.https.onRequest((req, res) => {
  const messageRef = admin.database().ref('/messages');
  const {head_commit} = req.body;
  return messageRef.push({
    content: '### repo update alert\n' + 'head commit...\n' + head_commit.url,
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
exports.addTokenToTopic = functions.https.onRequest(async (req, res) => {
  return cors(req, res, () => {
    const {name, fcmToken} = JSON.parse(req.body);
    admin.messaging().subscribeToTopic([fcmToken], 'name')
      .then(function(response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log('Successfully subscribed to topic:', response);
        res.send(response);
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
  // The topic name can be optionally prefixed with "/topics/".
    const {topic, message} = JSON.parse(req.body);
    const payloadMessage = {
      data: {
        score: '850',
        time: '2:45'
      },
      topic
    };

    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(payloadMessage)
      .then((response) => {
        // Response is a message ID string.
        res.send(response);
      })
      .catch((error) => {
        res.send(error);
      });
  });
});
