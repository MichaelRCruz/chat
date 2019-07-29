import React from 'react';
// import { goFetch, debouncer, throttling } from './utils.js';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom';
import RealTimeApi from './RealTimeApi.js';
import SessionContext from './SessionContext.js';
import {throttling} from './utils.js';
// import { staticMessages, staticUsers, staticRooms } from './staticState.js';

class SessionProvider extends React.Component {

  handleConnection = async (uid, userConfig) => {
    firebase.database().ref('.info/connected').on('value', async snap => {
      const db = firebase.database();
      const userStatusDatabaseRef = await db.ref(`/USERS_ONLINE/${uid}`);
      const activityRef = await db.ref(`/users/${uid}/activity`);
      if (snap.val() === false) {
        const trafficRef = await db.ref(`/TRAFFIC`);
        const newTrafficRef = await trafficRef.push();
        const unixStamp = await firebase.database.ServerValue.TIMESTAMP;
        await userStatusDatabaseRef.onDisconnect().remove();
        // await newTrafficRef.set({ ...userConfig, unixStamp, action: 'brb' });
        await newTrafficRef.onDisconnect().set({ ...userConfig, unixStamp, action: 'brb' });
      } else {
        const trafficRef = await db.ref(`/TRAFFIC`);
        const newTrafficRef = await trafficRef.push();
        const unixStamp = await firebase.database.ServerValue.TIMESTAMP;
        const activityInfo = { action: 'sup', unixStamp };
        const onlineUser = { ...activityInfo, ...userConfig };
        if (uid) activityRef.set(activityInfo);
        if (uid) userStatusDatabaseRef.set(onlineUser);
        if (uid) newTrafficRef.set({ ...userConfig, unixStamp, action: 'sup' });
        await userStatusDatabaseRef.onDisconnect().remove();
        await activityRef.onDisconnect().remove();
        await newTrafficRef.onDisconnect().set({ ...userConfig, unixStamp, action: 'brb' });
      }
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

  setListeners = key => {
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

  updateActiveRoom = async roomId => {
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
    activeUsers: [],
    userConfigs: {},
    traffic: [],
    prevRoomId: this.props.foreignState.rm ? this.props.foreignState.rm : null
  };

  initializeApp = async (user, foreignState, config, payload) => {
    // res.json({ userConfig, activeRoom: room, subscribedRooms: [room, `uid-${uid}`] })
    // firebase.auth().signOut();
    // debugger;
    const { rm, msg, usr } = foreignState;
    const { userConfig } = await new RealTimeApi().getUserConfig(user.uid);
    const configuration = config ? config : userConfig;
    const lastVisited = configuration.lastVisited;
    const { response, warning } = await this.reconcileActiveRoom(rm);
    const roomId = response ? response.key : lastVisited;
    const activeRoom = response ? response : await new RealTimeApi().getActiveRoom(roomId);
    const fcmToken = await this.initNotifications(user.uid);
    const { subscribedRooms } = await new RealTimeApi().getRooms(configuration.rooms);
    const subscriberIds = Object.keys(activeRoom.users);
    const { userConfigs } = await new RealTimeApi().getUserConfigs(subscriberIds);
    const { messages } = await new RealTimeApi().getMessages(roomId, 100);
    this.setState({ userConfig: configuration, activeRoom, userConfigs, fcmToken, subscribedRooms, messages, user }, () => {
      if (user) this.setListeners(this.state.activeRoom.key);
    });
  };

  componentDidMount() {
    // firebase.auth().signOut();
    const { foreignState } = this.props;
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        const { providerData, ...rest } = user;
        const { displayName, email, photoURL, emailVerified, uid } = rest;
        const authProviders = providerData.map(profile => {
          return {...profile};
        });
        const { userConfig } = await new RealTimeApi().getUserConfig(uid);
        const room = userConfig ? userConfig.lastVisited : null;
        const rooms = userConfig ? userConfig.rooms : null;
        const lastVisited = room ? room : '-Ld7mZCDqAEcMSGxJt-x';
        const subs = rooms ? rooms : ['-Ld7mZCDqAEcMSGxJt-x', `uid-${uid}`];
        const authProfile = {
          displayName, email, photoURL, emailVerified, uid, lastVisited, subs, authProviders
        };
        this.handleConnection(uid, authProfile);
        if (userConfig) {
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
