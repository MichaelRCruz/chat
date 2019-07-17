import React from 'react';
// import { goFetch, debouncer, throttling } from './utils.js';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom';
import RealTimeApi from './RealTimeApi.js';
import SessionContext from './SessionContext.js';
// import { staticMessages, staticUsers, staticRooms } from './staticState.js';

class SessionProvider extends React.Component {

  handleConnection = uid => {
    const userStatusDatabaseRef = firebase.database().ref(`users/${uid}/activity`);
    const isOfflineForDatabase = {
      isOnline: false,
      lastChanged: firebase.database.ServerValue.TIMESTAMP,
    };
    const isOnlineForDatabase = {
      isOnline: true,
      lastChanged: firebase.database.ServerValue.TIMESTAMP,
    };
    firebase.database().ref('.info/connected').on('value', function(snapshot) {
      if (snapshot.val() === false) {
        return;
      };
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
        console.log('lekmsd');
        userStatusDatabaseRef.update(isOnlineForDatabase);
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
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
  };

  initNotifications = async user => {
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging();
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

  setListeners = (key) => {
    const usersRef = firebase.database().ref(`users`);
    // const users = Object.keys(activeRoom.users);
    usersRef
      .orderByChild('lastVisited')
      .equalTo(key)
      // .limitToLast(1)
      .on('child_added', snap => {
        // const isSubscribed = users.includes(snap.key);
        // console.log(snap.val().activity.isOnline, snap.val().email);

          console.table({
            'email': snap.val().email,
            'isOnline': snap.val().activity.isOnline,
            'lastVisited': snap.val().lastVisited,
          });

        // this.setState({ users });
      });
      // console.log(snap.val().activity.isOnline, snap.val().email);
    this.messagesRef
      .orderByChild('roomId')
      .equalTo(key)
      .limitToLast(1)
      .on('child_added', async snapshot => {
        if (snapshot.val().roomId === key) {
          // const messages = this.state.messages;
          // const newMessages = { ...messages,  ...{ [snapshot.key]: snapshot.val() }}
          // const newMessages = Object.assign({}, messages, { [snapshot.key]: snapshot.val() });
          const { messages } = await new RealTimeApi().getMessages(snapshot.val().roomId, 100);
          this.setState({ messages });
        }
      });
    this.messagesRef
      .orderByChild('roomId')
      .equalTo(key)
      .limitToLast(1)
      .on('child_removed', async snapshot  => {
        if (snapshot.val().roomId === key) {
          const { messages } = await new RealTimeApi().getMessages(snapshot.val().roomId, 100);
          // const deletedKey = snapshot.key;
          // const { [deletedKey]: something, ...rest } = this.state.messages;
          // const newMessages = Object.assign({}, rest);
          this.setState({ messages });
        }
    });
  };

  reconcileActiveRoom = async roomId => {
    const response = await new RealTimeApi().getActiveRoom(roomId);
    if (response !== null) {
      return { response, warning: false };
    } else {
      return { response, warning: 'This room does not exist.' }
    }
  }

  updateActiveRoom = async (roomId) => {
    const user = firebase.auth().currentUser;
    const { response, warning } = await this.reconcileActiveRoom(roomId);
    if (user && !warning && response) {
      let error = null;
      const activeRoom = response;
      // this.setListeners(roomId);
      const { messages } = await new RealTimeApi().getMessages(roomId, 100);
      const ref = await firebase.database().ref(`users/${user.uid}/lastVisited`);
      await ref.set(roomId, dbError => error = dbError );
      await this.setState({ messages, activeRoom, warning, error }, () => {
        this.setListeners(roomId);
        ref.off();
      });
    };
  };

  submitMessage = content => {
    const { displayName, email, photoURL, uid } = this.state.user;
    const messagesRef = firebase.database().ref(`messages`);
    const newMessageRef = messagesRef.push();
    const message = {
      content,
      "creator": { displayName, email, photoURL, uid },
      "key": newMessageRef.key,
      "read" : false,
      "roomId" : this.state.activeRoom.key,
      "sentAt" : Date.now()
    };
    newMessageRef.set(message, error => {
      if (error) {
        this.setState({ error });
      }
    });
  };

  deleteMessage = msg => {
    const ref = firebase.database().ref(`messages`);
    ref.child(msg.key).remove();
  };

  onlineUsersRef = firebase.database().ref(`users`);
  messagesRef = firebase.database().ref(`messages`);
  state = {
    firebase: firebase,
    activeRoom: {},
    fcmToken: '',
    user: {},
    userConfig: {},
    messages: {},
    subscribedRooms: [],
    users: {},
    prevRoomId: this.props.foreignState.rm ? this.props.foreignState.rm : null
  };

  initializeApp = async (user, foreignState, config, payload) => {
    // res.json({ userConfig, activeRoom: room, subscribedRooms: [room, `uid-${uid}`] })
    // firebase.auth().signOut();
    // this.handleConnection();
    // debugger;
    const { rm, msg, usr } = foreignState;
    const { userConfig } = await new RealTimeApi().getUserConfig(user.uid);
    const configuration = config ? config : userConfig;
    const lastVisited = configuration.lastVisited;
    const { response, warning } = this.reconcileActiveRoom(rm);
    const roomId = response ? response.key : lastVisited;
    const activeRoom = response ? response : await new RealTimeApi().getActiveRoom(roomId);
    const fcmToken = await this.initNotifications(user.uid);
    const { subscribedRooms } = await new RealTimeApi().getRooms(configuration.rooms);
    const subscriberIds = Object.keys(activeRoom.users)
    const { userConfigs } = await new RealTimeApi().getUserConfigs(subscriberIds);
    const { messages } = await new RealTimeApi().getMessages(roomId, 100);
    this.setState({ userConfig: configuration, activeRoom, userConfigs, fcmToken, subscribedRooms, messages, user }, () => {
      this.handleConnection(user.uid);
      // this.setListeners(this.state.activeRoom.key);
    });
  };

  componentDidMount() {
    // firebase.auth().signOut();
    const { foreignState } = this.props;
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        this.handleConnection();
        const { providerData, ...rest } = user;
        const { displayName, email, photoURL, emailVerified, uid } = rest;
        const authProviders = providerData.map(profile => {
          return {...profile};
        });
        const authProfile = {
          displayName,
          email,
          photoURL,
          emailVerified,
          uid,
          authProviders
        };
        const { userConfig } = await new RealTimeApi().getUserConfig(uid);
        if (userConfig) {
          // userConfig.authProfile = authProfile;
          this.initializeApp(user, foreignState, userConfig, null);
        } else {
          const payload = await new RealTimeApi().createNewUser(authProfile);
          this.initializeApp(user, foreignState, payload.userConfig, payload);
        }
      } else {
        firebase.auth().signOut();
      }
    });
  };

  static getDerivedStateFromProps(props, state) {
    const { rm: roomId } = props.foreignState;
    if (roomId !== state.prevRoomId) {
      return {
        prevRoomId: roomId
      };
    }
    return null;
  };


  componentDidUpdate(prevProps, prevState) {
    if (this.props.foreignState.rm !== prevState.prevRoomId) {
      this.updateActiveRoom(this.props.foreignState.rm);
    }
  }

  render() {
    return (
      <SessionContext.Provider value={{
        state: this.state,
        submitMessage: content => {
          this.submitMessage(content);
        },
        deleteMessage: key => {
          this.deleteMessage(key);
        }
      }}>
        {this.props.children}
      </SessionContext.Provider>
    );
  }
}

export default withRouter(SessionProvider);
