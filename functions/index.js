const functions = require('firebase-functions');

const admin = require('firebase-admin');
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

exports.createRoomAndUserConfig = functions.auth.user().onCreate(user => {
  const roomRef = admin.database().ref('/rooms');
  roomRef.push({
    temp: 'temp test',
    active: false,
    creator: user.uid,
    dscription: `${user.displayName}'s first Potato. Welcome!`,
    moderators: [user.uid],
    name: `${user.displayName}'s Potato`
  }).then(res => {
    // console.log('res.repo.path: ', res.repo.path.pieces_[1]);
    console.log('res: ', res);
  }).catch(error => {
    console.log(error);
  });
});

// function createRoom(user) {
//   const roomRef = admin.database.ref('rooms');
//   return roomRef.push({
//     active: false,
//     creator: user.uid,
//     dscription: `${user.displayName}'s first Potato.`,
//     moderators: [user.uid],
//     name: `${user.displayName}'s Potato`
//   });
// };
