const functions = require('firebase-functions');
const cors = require('cors')({
  origin: true,
});

const admin = require('firebase-admin');
serviceAccount = require('./serviceAccountKey.json');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(functions.config().firebase);

exports.createRoomAndUserConfig = functions.https.onRequest((req, res) => {
  function getRooms(roomIds) {
    return new Promise((resolve, reject) => {
      let rooms = [];
      roomIds.forEach(room => {
        const roomRef = admin.database().ref(`rooms/${room}`);
        let promise = roomRef.once('value');
        rooms.push(promise);
      });
      resolve(Promise.all(rooms));
    });
  }
  return cors(req, res, () => {
    res.set('Access-Control-Allow-Origin', '*');
    const {uid, displayName} = JSON.parse(req.body);
    const userRef = admin.database().ref('/users');
    const roomRef = admin.database().ref('/rooms');
    const userConfig = {
      displayName,
      lastVisited: `uid-${uid}`,
      rooms: [`uid-${uid}`, '-Ld7mZCDqAEcMSGxJt-x'],
      activity: {
        isOnline: true,
        lastChanged: Math.floor(Date.now() / 1000)
      }
    }
    const room = {
      active: false,
      creator: uid,
      dscription: `${displayName}'s first Potato. Welcome!`,
      moderators: [uid],
      name: `${displayName}'s Potato`,
      key: `uid-${uid}`,
      users: { [uid]: displayName }
    }
    return userRef.child(uid).once("value", async snapshot => {
      if (!snapshot.exists()) {
        return userRef.child(uid).update(userConfig)
        .then(snapshot => {
          return roomRef.child(`uid-${uid}`).update(room)
          .then(async () => {
            const subscribedRooms = await getRooms(userConfig.rooms);
            res.json({ userConfig, activeRoom: room, subscribedRooms });
          });
        });
      } else {
        const currentUserConfig = await snapshot.val();
        const currentLastVisited = currentUserConfig.lastVisited;
        const currentSubscribedRooms = await getRooms(currentUserConfig.rooms);
        const currentActiveRoom = await getRooms([currentLastVisited]);
        res.json({ userConfig: currentUserConfig, activeRoom: currentActiveRoom[0], subscribedRooms: currentSubscribedRooms });
      }
    })
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


// https://us-central1-chat-asdf.cloudfunctions.net/verifyDisplayname
exports.verifyDisplayname = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    res.set('Access-Control-Allow-Origin', '*');
    const displayname = req.query.displayname;
    displaynameRef = admin.database().ref(`users`);
    await displaynameRef.orderByChild('createdAt').once("value", async snap => {
      snap.forEach(user => {
        if (user.val().displayName === displayname) {
          res.send(false);
        }
      });
    });
    res.send(true);
  });
});
