const functions = require('firebase-functions');
const cors = require('cors')({
  origin: true,
});

const admin = require('firebase-admin');
serviceAccount = require('./serviceAccountKey.json');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(functions.config().firebase);

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
    const {uid, fcmToken, subscription} = JSON.parse(req.body);
    const userRef = admin.database().ref(`/users/${uid}/fcmTokens`);
    admin.messaging().subscribeToTopic([fcmToken], `topic-${uid}`)
      .then(function(response) {
        // See the MessagingTopicManagementResponse reference documentation
        // for the contents of response.
        console.log('Successfully subscribed to topic:', response);
        return userRef.child(fcmToken).set(subscription).then(function() {
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
        const isIncluded = displayNames.includes(user.val().displayName);
        const hasFcmTokens = user.val().fcmTokens;
        if (isIncluded && hasFcmTokens) {
          targetedUser = true;
          const fcmTokens = Object.keys(user.val().fcmTokens);
          multiCastTokens = multiCastTokens.concat(fcmTokens);
        }
      });
      if (targetedUser) {
        const payload = {
          data: { title: 'Approachable is better than simple.', message}
        };
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

exports.getMessages = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const roomId = req.query.roomId;
    const messageCount = parseInt(req.query.messageCount, 10);
    const messagesRef = admin.database().ref(`messages`);
    messagesRef.orderByChild('sentAt').limitToLast(messageCount).once("value", snap => {
      const messages = [];
      snap.forEach(message => {
        if (message.val().roomId === roomId) {
          const messageWithKey = Object.assign({}, message.val(), {key: message.key});
          messages.push(messageWithKey);
        }
      });
      res.set('Access-Control-Allow-Origin', '*');
      res.send(messages);
    });
  });
});

exports.handleSignOut = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.set('Access-Control-Allow-Origin', '*');
    const uid = req.query.uid;
    const pendingFcmToken = req.query.fcmToken;
    admin.database().ref(`/users/${uid}/fcmTokens/${pendingFcmToken}`).set(false)
    .then(() => res.send(true));
  });
});
