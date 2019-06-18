import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { goFetch, debouncer } from './utils.js';
import SessionContext from './SessionContext.js';

class SessionProvider extends PureComponent {
  firebase = this.props.firebase;
  state = {
    activeRoom: {},
    fcmToken: '',
    user: {},
    userConfig: {}
  };

  updateSession = options => {
    this.setState(options);
  };

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

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   const nextUser = nextProps.session.state.user.displayName || '';
  //   const currentUser = this.session.state.user.displayName || '';
  //   if (nextUser !== currentUser) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  componentDidMount() {
    // this.firebase.auth().signOut();
    this.handleConnection();
    this.firebase.auth()
      .onAuthStateChanged(async user => {
        if (!user) {
          this.updateSession({ onAuthStateChangedError: true });
          this.firebase.auth().signOut();
        } else {
          const fcmToken = await this.initNotifications(user);
          const {userConfig} = await this.getUserConfig(user.uid);
          const activeRoom = await this.getActiveRoom(userConfig.lastVisited);
          this.updateSession({ userConfig, activeRoom, user, fcmToken });
        }
      });
    this.firebase.auth()
      .getRedirectResult()
      .then(result => {
        if (result.credential) {
          const { credential } = result;
          const isNewUser = result.additionalUserInfo.isNewUser;
          this.updateSession({ credential, isNewUser });
        }
      })
      .catch(error => {
        this.updateSession({ error, onGetRedirectResultError: true });
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
            this.updateSession({ credential, isNewUser });
          }
        })
        .catch(error => {
          this.updateSession({ error, onSignInWithEmailLinkError: true });
        });
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
        updateSession: thing => {
          this.setState({ thing })
        }
      }}>
        {this.props.children}
      </SessionContext.Provider>
    );
  };

}

export default SessionProvider;
