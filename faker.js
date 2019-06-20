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
  const ref = firebase.database().ref().child(`messages`);
  for (let i = 10; i < 100; i++) {
    const messageKey = ref.push().key;
    // const creator = [{
    //   "displayName" : this.faker.internet.userName(),
    //   "email" : this.faker.internet.email(),
    //   "photoURL" : this.faker.internet.avatar(),
    //   "uid" : this.faker.random.alphaNumeric()
    // }]
    const message = {
      "content" : faker.lorem.text(),
      "creator" : {
        "displayName" : this.faker.internet.userName(),
        "email" : this.faker.internet.email(),
        "photoURL" : this.faker.internet.avatar(),
        "uid" : this.faker.random.alphaNumeric()
      },
      "key": messageKey,
      "read" : faker.hacker.phrase(),
      "roomId" : "-Ld7mZCDqAEcMSGxJt-x",
      "sentAt" : faker.date.past(),
    }
    messages[messageKey] = message;
  }
  ref.off();
  return messages;
}

let messages = generateMessages();
fs.writeFileSync('/Users/michael/code/chat/src/assets/staticState/staticMessages.js', JSON.stringify(messages, null, '\t'));
