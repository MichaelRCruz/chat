import React from 'react';
import { Route } from 'react-router-dom';
import { goFetch, debouncer, throttling } from './utils.js';
import * as firebase from 'firebase';
import useUser from './hooks/useUser.js';
import {useMessages} from './hooks/useMessages.js';
import SessionContext from './SessionContext.js';1

// import { useDeletedMessage } from './hooks/useDeletedMessage.js';
// import { useFcmToken } from './hooks/useFcmToken.js';
// import { useNewMessage } from './hooks/useNewMessage.js';
// import { useNewUser } from './hooks/useNewUser.js';
// import { usePresence } from './hooks/usePresence.js';

function SessionProvider(props) {
  const [user, uid] = useUser();
  const [messages, loading] = useMessages('-Ld7mZCDqAEcMSGxJt-x');
  console.log(uid);
  console.log(loading, messages);

  const getRooms = async rooms => {
    const url = `${process.env.REACT_APP_HTTP_URL}/getRooms`;
    const roomIds = rooms ? rooms : [];
    const subscribedRooms = await goFetch(url, {
      method: 'POST',
      body: JSON.stringify({ roomIds })
    });
    return subscribedRooms ? subscribedRooms : {};
  };
  // const getMessages = (roomId, messageCount) => {
  //   return fetch(`${process.env.REACT_APP_HTTP_URL}/getMessages`, {
  //     method: 'POST',
  //     body: JSON.stringify({ roomId, messageCount })
  //   })
  //   .then(res => {
  //     return res.json();
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // };
  const getUserConfig = async uid => {
    const url = `${process.env.REACT_APP_HTTP_URL}/getUserConfig`;
    const userConfig = await goFetch(url, {
      method: 'POST',
      body: JSON.stringify({ uid })
    });
    return userConfig;
  };
  const getActiveRoom = async roomId => {
    const payload = [roomId];
    const url = `${process.env.REACT_APP_HTTP_URL}/getRooms`;
    const response = await goFetch(url, {
      method: 'POST',
      body: JSON.stringify({ roomIds: payload })
    });
    return response.subscribedRooms[0];
  };

  const updateActiveRoom = async roomId => {
    const { uid, lastVisited } = this.state.user;
    const ref = firebase.database().ref(`users/${uid}/lastVisited`);
    ref.set(roomId);
    ref.off();
  }

  const submitMessage = content => {
    const { displayName, email, photoURL, uid } = this.state.user;
    const messagesRef = firebase.database().ref(`messages`);
    const newMessageRef = messagesRef.push();
    let messages = this.state.messages;
    const message = {
      content,
      "creator": { displayName, email, photoURL, uid },
      "key": newMessageRef.key,
      "read" : false,
      "roomId" : this.state.activeRoom.key,
      "sentAt" : Date.now()
    }
    newMessageRef.set(message, error => {
      if (error) {
        this.setState({ error });
      }
    });
  };

  const deleteMessage = msg => {
    const ref = firebase.database().ref(`messages`);
    ref.child(msg.key).remove();
  };

  // firebase.auth().signOut();
  // debugger;
  //
  // const uid = firebase.auth().onAuthStateChanged(async user => {
  //   // this.handleConnection();
  //   if (!user) {
  //     // this.setState({ onAuthStateChangedError: true });
  //     firebase.auth().signOut();
  //   } else {
  //     return user.uid;
  //     // const { userConfig } = await getUserConfig(user.uid);
  //     // const lastVisited = userConfig.lastVisited;
  //     // // await setListeners(lastVisited);
  //     // // const fcmToken = await this.initNotifications(user);
  //     // const activeRoom = await getActiveRoom(lastVisited);
  //     // const { subscribedRooms } = await getRooms(userConfig.rooms);
  //     // const { messages } = await getMessages(lastVisited, 100);
  //     // // this.setState({ userConfig, activeRoom, user, fcmToken, subscribedRooms, messages });
  //   }
  // });
  let state = {
    activeRoom: {},
    fcmToken: '',
    user: {},
    userConfig: {},
    messages: {},
    subscribedRooms: [],
    users: []
  };
  return (
    <SessionContext.Provider value={{
      state,
      updateActiveRoom: roomId => {
        updateActiveRoom(roomId);
      },
      submitMessage: content => {
        submitMessage(content);
      },
      deleteMessage: key => {
        deleteMessage(key);
      }
    }}>
      {props.children}
    </SessionContext.Provider>
  );
}

export default SessionProvider;
