const faker = require('faker');
const fs = require('fs');
const firebase = require('firebase');
const config = {
  apiKey: 'AIzaSyCxVWvMMALFtyiS99HtFzLIF1QQqnv1P2s',
  authDomain: 'chat-asdf.firebaseapp.com',
  databaseURL: 'https://chat-asdf.firebaseio.com',
  projectId: 'chat-asdf',
  storageBucket: 'chat-asdf.appspot.com',
  messagingSenderId: '145747598382'
};
firebase.initializeApp(config);

let messages = [];
function generateMessages() {
  let messages = {};
  const ref = this.firebase.database().ref().child(`messages`);
  for (let i = 10; i < 10; i++) {
    const messageKey = ref.push().key;
    const message = {
      "content" : faker.hacker.phrase(),
      "creator" : {
        "displayName" : faker.internet.userName(),
        "email" : faker.internet.email(),
        "photoURL" : faker.internet.avatar(),
        "uid" : faker.random.alphaNumeric()
      },
      "key": messageKey,
      "read" : true,
      "roomId" : "uid-N4OX2pYK4uSlDsyFmUurr0uuL293",
      "sentAt" : 1558661840808,
    }
    messages[messageKey] = message;
  }
  ref.off();
  return messages;
}

let messages = generateMessages();
fs.writeFileSync('/Users/michael/code/chat/src/assets/staticState/staticMessages.js', JSON.stringify(messages, null, '\t'));
