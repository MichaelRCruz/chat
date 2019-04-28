const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.json({"greeting": "sup, yo"});
});

exports.handleHttpRedirect = functions.https.onRequest((req, res) => {
  console.log('inside handleHttpRedirect');
  res.redirect(303, 'https://michaelcruz.io/chat');
});

exports.insertIntoDb = functions.https.onRequest((req, res) => {
  const text = req.query.text;
  admin.database().ref('/test').push({text: text}).then(snapshot => {
    console.log('snapshot.ref: ', snapshot.ref);
    res.redirect(303, snapshot.ref);
  });
});

exports.convertToUppercase = functions.database.ref('/test/{pushId}/text')
  .onWrite(event => {
    const text = event.data.val();
    const uppercaseText = text.toUpperCase();
    console.log('text uppercaseText', text, uppercaseText);
    return event.data.ref.parent.child('uppercaseText').set(uppercaseText);
;});
