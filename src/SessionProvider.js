import React from 'react';
import { Route } from 'react-router-dom';
import { goFetch, debouncer, throttling } from './utils.js';
import SessionContext from './SessionContext.js';

class SessionProvider extends React.PureComponent {
  firebase = this.props.firebase;
  onlineUsersRef = this.firebase.database().ref(`users`);
  messagesRef = this.firebase.database().ref(`messages`);
  state = {
    activeRoom: {},
    fcmToken: '',
    user: {},
    userConfig: {},
    messages: {},
    subscribedRooms: [],
    users: []
  };
  // updateSession = options => {
  //   this.setState(options);
  // };

  handleConnection = uid => {
    const userStatusDatabaseRef = this.firebase.database().ref(`users/${uid}/activity`);
    const isOfflineForDatabase = {
      isOnline: false,
      lastChanged: this.firebase.database.ServerValue.TIMESTAMP,
    };
    const isOnlineForDatabase = {
      isOnline: true,
      lastChanged: this.firebase.database.ServerValue.TIMESTAMP,
    };
    this.firebase.database().ref('.info/connected').on('value', function(snapshot) {
      if (snapshot.val() === false) {
        return;
      };
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    });
  };

  requestNotifPermission = (uid, messaging) => {
    return messaging.requestPermission()
    .then(() => {
      const fcmToken = messaging.getToken();
      return fcmToken;
    })
    .then(token => {
      console.log(token);
      return this.handleFcmToken(token, uid, true)
      .then(fcmToken => {
        return token;
      });
    })
    .catch(error => {
      console.log('error occured from requestNotifPermission()', error);
      return error;
    });
  };

  handleFcmToken = (fcmToken, uid, subscription) => {
    return fetch(`${process.env.REACT_APP_HTTP_URL}/addTokenToTopic`, {
      method: 'POST',
      body: JSON.stringify({ fcmToken, uid, subscription})
    })
    .then(function(response) {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
  };

  initNotifications = async user => {
    if (this.firebase.messaging.isSupported()) {
      const messaging = this.firebase.messaging();
      const currentFcmToken = await messaging.getToken();
      this.handleFcmToken(currentFcmToken, user.uid, true);
      messaging.onTokenRefresh(async () => {
        console.log('refreshed token');
        const fcmToken = await this.requestNotifPermission(user.uid, messaging);
        return fcmToken;
      });
    } else {
      return false;
    }
  };

  setListeners(activeRoomKey) {
    const onlineUsers = [];
    const userThrottler = throttling(() => {
      this.setState({ onlineUsers: onlineUsers.slice(0) });
    }, 100);
    this.onlineUsersRef
      .on('child_added', snapshot => {
      const onlineUser = Object.assign(snapshot.val(), {key: snapshot.key});
      if (onlineUser.activity.isOnline) {
        onlineUsers.push(onlineUser);
      }
      userThrottler();
    });
    this.messagesRef
      .orderByChild('roomId')
      .equalTo(activeRoomKey)
      .limitToLast(1)
      .on('child_added', snapshot => {
        if (snapshot.val().roomId === activeRoomKey) {
          const message = Object.assign({}, snapshot.val(), { key: snapshot.key });
          this.updateMessages(message);
        }
    });
    this.messagesRef
      .orderByChild('roomId')
      .equalTo(activeRoomKey)
      .limitToLast(1)
      .on('child_removed', snapshot  => {
        if (snapshot.val().roomId === activeRoomKey) {
          const message = Object.assign({}, snapshot.val(), { key: snapshot.key });
          this.updateMessages(message);
        }
    });
  };

  componentDidMount() {
    // this.firebase.auth().signOut();
    // debugger;
    this.handleConnection();
    this.firebase.auth()
      .onAuthStateChanged(async user => {
        if (!user) {
          this.setState({ onAuthStateChangedError: true });
          this.firebase.auth().signOut();
        } else {
          const fcmToken = await this.initNotifications(user);
          const {userConfig} = await this.getUserConfig(user.uid);
          const activeRoom = await this.getActiveRoom(userConfig.lastVisited);
          const {subscribedRooms} = await this.getRooms(userConfig.rooms);
          const {messages} = await this.getMessages(activeRoom.key, 100);
          this.setState({ userConfig, activeRoom, user, fcmToken, messages, subscribedRooms });
        }
      });
    this.firebase.auth()
      .getRedirectResult()
      .then(result => {
        if (result.credential) {
          const { credential } = result;
          const isNewUser = result.additionalUserInfo.isNewUser;
          this.setState({ credential, isNewUser });
        }
      })
      .catch(error => {
        this.setState({ error, onGetRedirectResultError: true });
      });
    if (this.firebase.auth().isSignInWithEmailLink(window.location.href)) {
      const stashedEmail = window.localStorage.getItem('emailForSignIn');
      this.firebase.auth()
        .signInWithEmailLink(stashedEmail, window.location.href)
        .then(result => {
          if (result.credential) {
            window.localStorage.removeItem('emailForSignIn');
            const { credential, user } = result;
            const isNewUser = result.additionalUserInfo.isNewUser;
            this.setState({ credential, isNewUser });
          }
        })
        .catch(error => {
          this.setState({ error, onSignInWithEmailLinkError: true });
        });
    }
  };

  getRooms = async rooms => {
    console.log(this.props.session);
    const url = `${process.env.REACT_APP_HTTP_URL}/getRooms`;
    const roomIds = rooms ? rooms : [];
    const subscribedRooms = await goFetch(url, {
      method: 'POST',
      body: JSON.stringify({ roomIds })
    });
    return subscribedRooms ? subscribedRooms : {};
  };

  getMessages = (roomId, messageCount) => {
    return fetch(`${process.env.REACT_APP_HTTP_URL}/getMessages`, {
      method: 'POST',
      body: JSON.stringify({ roomId, messageCount })
    })
    .then(res => {
      return res.json();
    }).catch(error => {
      console.log(error);
    });
  };

  getUserConfig = async uid => {
    const url = `${process.env.REACT_APP_HTTP_URL}/getUserConfig`;
    const userConfig = await goFetch(url, {
      method: 'POST',
      body: JSON.stringify({ uid })
    });
    return userConfig;
  };

  getActiveRoom = async roomId => {
    const payload = [roomId];
    const url = `${process.env.REACT_APP_HTTP_URL}/getRooms`;
    const response = await goFetch(url, {
      method: 'POST',
      body: JSON.stringify({ roomIds: payload })
    });
    return response.subscribedRooms[0];
    // return activeRoom;
  };

  handleRoomChange = async roomId => {
    const isCurrent = this.state.activeRoom.key === roomId;
    if (true) {
      const { messages } = await this.getMessages(roomId, 100);
      const { subscribedRooms } = await this.getRooms([roomId]);
      this.setState({ messages, activeRoom: subscribedRooms[0] });
    } else {
      console.log('failed to switch room');
    }
  };

  render() {
    // const sessionValue = {
    //   activeRoom: this.state.activeRoom,
    //   fcmToken: this.state.fcmToken,
    //   user: this.state.user,
    //   userConfig: this.state.userConfig,
    //   updateSession: this.state.updateSession
    // }
    return (
      <SessionContext.Provider value={{
        state: this.state,
        updateRoom: roomId => {
          this.handleRoomChange(roomId);
        }
      }}>
        {this.props.children}
      </SessionContext.Provider>
    );
  };

}

export default SessionProvider;
