import React from 'react';
// import { goFetch, debouncer, throttling } from './utils.js';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom';
import RealTimeApi from './RealTimeApi.js';
import SessionContext from './SessionContext.js';
import {throttling} from './utils.js';
// import { staticMessages, staticUsers, staticRooms } from './staticState.js';

class SessionProvider extends React.Component {


  handleConnection = (uid) => {
    const userStatusDatabaseRef = this.props.firebase.database().ref(`/USERS_ONLINE/${uid}`);
    let config = this.state.userConfig;
    let activityInfo = {};
    firebase.database().ref('.info/connected').on('value', function(snapshot) {
      if (snapshot.val() === false) {
        activityInfo = {
          isOnline: false,
          lastChanged: firebase.database.ServerValue.TIMESTAMP,
          config
        }
        userStatusDatabaseRef.set(activityInfo);
        return;
      };
      userStatusDatabaseRef.onDisconnect().set(activityInfo).then(function() {
        activityInfo = {
          isOnline: true,
          lastChanged: firebase.database.ServerValue.TIMESTAMP,
          config
        }
        userStatusDatabaseRef.set(activityInfo);
      });
    });

    const muhUpdateRef = this.props.firebase.database().ref(`/USERS_ONLINE`);
    let users = [];
    const userThrottler = throttling(() => {
      this.setState({onlineUsers: users.slice(0)});
    }, 100);

    muhUpdateRef.on('child_added', snap => {
      const newUser = Object.assign(snap.val(), {key: snap.key});
      users.push(newUser);
      userThrottler();
    });

    // update the UI to show that a user has left (gone offline)
    muhUpdateRef.on("child_removed", snap => {
      const deletedUser = snap.val();
      const deletedUsers = [...this.state.onLineUsers];
      const index = deletedUsers.indexOf(deletedUser)
      if (index !== -1) {
        deletedUsers.splice(index, 1);
        this.setState({ onLineUsers: deletedUsers });
      }
      console.log(deletedUser.key);
    });

    // update the UI to show that a user's status has changed
    muhUpdateRef.on("child_changed", snap => {
      const updatedUser = snap.val();
      const muhUsers = this.state.onLineUsers ? this.state.onLineUsers : {};
      const updated = [...muhUsers];
      const index = updated.indexOf(updatedUser)
      if (index !== -1) {
        updated.splice(index, 1);
        updated.push(updatedUser);
        this.setState({ onLineUsers: updated });
      }
      console.log(updatedUser);
    });
  }

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
    if (!uid) return;
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
    const passers = {};
    const actives = {};
    const subs = {};
    const activeUsers = { passers, subs, actives };
    const userThrottler = throttling(() => {
      this.setState({ activeUsers });
    }, 100);
    const usersRef = firebase.database().ref(`users`);
    // const subscribedUsers = Object.keys(this.state.activeRoom.users);
    usersRef
      .orderByChild('lastVisited')
      .equalTo(key)
      .once('child_changed', snap => {
        const subscribedUsers = Object.keys(this.state.activeRoom.users);
        const isSub = subscribedUsers.includes(snap.key);
        const isActive = snap.val().activity.isOnline;
        if (isActive && !isSub) {
          passers[snap.key] = snap.val();
        } else if (isActive && isSub) {
          actives[snap.key] = snap.val();
        } else if (!isActive && !isSub) {
          subs[snap.key] = snap.val();
        }
        userThrottler();
      });

    this.messagesRef
      .orderByChild('roomId')
      .equalTo(key)
      .limitToLast(1)
      .on('child_added', async snapshot => {
        if (snapshot.val().roomId === key) {
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
      const subscriberIds = Object.keys(activeRoom.users)
      const { userConfigs } = await new RealTimeApi().getUserConfigs(subscriberIds);
      const ref = await firebase.database().ref(`users/${user.uid}/lastVisited`);
      await ref.set(roomId, dbError => error = dbError );
      await this.setState({ messages, activeRoom, subscriberIds, warning, error, userConfigs }, () => {
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

  usersRef = firebase.database().ref(`users`);
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
    activeUsers: {},
    userConfigs: {},
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
    const subscriberIds = Object.keys(activeRoom.users);
    const { userConfigs } = await new RealTimeApi().getUserConfigs(subscriberIds);
    const { messages } = await new RealTimeApi().getMessages(roomId, 100);
    this.setState({ userConfig: configuration, activeRoom, userConfigs, fcmToken, subscribedRooms, messages, user }, () => {
      if (user) this.handleConnection(user.uid);
      if (user) this.setListeners(this.state.activeRoom.key);
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
          if (content) this.submitMessage(content);
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
