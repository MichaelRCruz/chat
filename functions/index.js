const functions = require('firebase-functions');
const cors = require('cors')({
  origin: true,
});

const admin = require('firebase-admin');
serviceAccount = require('./serviceAccountKey.json');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp();

exports.getRoomsAndUserConfig = functions.https.onRequest((req, res) => {
  async function getRooms(roomIds) {
    return Promise.all(roomIds.map(async room => {
      const roomRef = await admin.database().ref(`rooms/${room}`);
      return roomRef.once('value');
    }));
  };
  return cors(req, res, () => {
    // res.set('Access-Control-Allow-Origin', '*');
    const { uid, displayName } = JSON.parse(req.body);
    const userRef = admin.database().ref('/users');
    const roomRef = admin.database().ref('/rooms');
    return userRef.child(uid).once("value", async snapshot => {
      if (snapshot.exists()) {
        const subscribedRooms = await getRooms(snapshot.val().rooms);
        res.json({ userConfig: snapshot.val(), subscribedRooms });
      } else {
        res.send('user config does not exist');
      }
    });
  });
});

exports.getUserConfig = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const { uid } = JSON.parse(req.body);
    const userRef = admin.database().ref(`users`);
    return userRef.child(uid).once("value", async snapshot => {
      if (snapshot.exists()) {
        const userConfig = snapshot.val();
        res.json({ userConfig: snapshot.val() });
      } else {
        res.json({ error: 'userConfig does not exist for this user' });
      }
    });
  });
});

exports.getRooms = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const { roomIds } = JSON.parse(req.body);
    async function getRooms(roomIds) {
      return Promise.all(roomIds.map(async room => {
        const roomRef = await admin.database().ref(`rooms/${room}`);
        return roomRef.once('value');
      }));
    };
    const subscribedRooms = await getRooms(roomIds);
    res.json({ subscribedRooms });
  });
});

exports.createRoomsAndUserConfig = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const { uid, displayName } = JSON.parse(req.body);
    const userRef = admin.database().ref('/users');
    const roomRef = admin.database().ref('/rooms');
    const messagesRef = admin.database().ref('/messages');
    const messageKey = messagesRef.push().key;
    const userConfig = {
      key: uid,
      displayName,
      lastVisited: '-Ld7mZCDqAEcMSGxJt-x',
      rooms: [`uid-${uid}`, '-Ld7mZCDqAEcMSGxJt-x'],
      activity: {
        isOnline: true,
        lastChanged: Math.floor(Date.now() / 1000),
      }
    };
    const room = {
      active: false,
      creator: uid,
      dscription: `${displayName}'s first room. Welcome!`,
      moderators: [uid],
      name: `${displayName}'s room`,
      key: `uid-${uid}`,
      users: { [uid]: displayName }
    };
    const message = {
      content: 'Welcome to your new app!',
      creator: {
        displayName: 'mykey',
        email: 'potato@michaelcruz.io',
        photoURL: 'https://lh3.googleusercontent.com/-42Rxl6komNU/AAAAAAAAAAI/AAAAAAAAAJ0/n2btuWyx90o/photo.jpg',
        uid: 'N4OX2pYK4uSlDsyFmUurr0uuL293'
      },
      key: messageKey,
      read: false,
      roomId: `uid-${uid}`,
      sentAt: Math.floor(Date.now() / 1000),
    };
    await userRef.child(uid).update(userConfig);
    await messagesRef.child(messageKey).update(message);
    await roomRef.child(`uid-${uid}`).update(room);
    res.json({ userConfig, activeRoom: room, subscribedRooms: [room, `uid-${uid}`] });
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
    const {displayNames, message} = JSON.parse(req.body);
    const usersRef = admin.database().ref('users');
    const userTargetsRef = admin.database().ref(`messages/${message.key}/mentions`);
    let targetedUser = false;
    usersRef.once("value", snap => {
      let multiCastTokens = [];
      let mentions = {};
      snap.forEach(user => {
        const isIncluded = displayNames.includes(user.val().displayName);
        if (isIncluded) mentions[user.key] = false;
        const hasFcmTokens = user.val().fcmTokens;
        if (isIncluded && hasFcmTokens) {
          targetedUser = true;
          const fcmTokens = Object.keys(user.val().fcmTokens);
          multiCastTokens = multiCastTokens.concat(fcmTokens);
        }
      });
      if (targetedUser) {
        userTargetsRef.set(mentions);
        const payload = {
          notification: {
            title: `new mention from ${message.creator.displayName}`,
            body: message.content
          },
          data: {
            message: JSON.stringify(message)
          }
        };
        admin.messaging().sendToDevice(multiCastTokens, payload)
        .then((response) => {
          res.send(response);
        })
        .catch((error) => {
          res.send(error);
        });
      } else {
        res.send('message failed to send');
      }
    });
  });
});

exports.getMessages = functions.https.onRequest((req, res) => {
  async function getNotifications(messageKeys) {
    return Promise.all(messageKeys.map(messageKey => {
      const messageRef = admin.database().ref(`messages/${messageKey}`);
      return messageRef.once('value');
    }));
  };
  return cors(req, res, async () => {
    const { roomId, messageCount, messageKeys } = JSON.parse(req.body);
    const messagesRef = await admin.database().ref(`messages`);
    const notifications = await getNotifications(messageKeys);
    await messagesRef
      .orderByChild('roomId')
      .equalTo(roomId)
      .limitToLast(messageCount)
      .once("value", async snap => {
        const messages = snap.val();
        res.send({ messages, notifications });
      }
    );
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
