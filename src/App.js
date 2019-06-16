import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Chat from './Chat/Chat.js';
import Splash from './Splash/Splash.js';
import SignIn from './SignIn/SignIn.js';
import SessionContext from './SessionContext.js';

class App extends Component {
  firebase = this.props.firebase;
  state = {
    // updateSession: () => {},
    // userConfig: {},
    // subscribedRooms: [],
    // activeRoom: {},
    // user: {},
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
      return messaging.getToken();
    })
    .then(token => {
      console.log(token);
      return this.handleFcmToken(token, uid, true)
      .then(fcmToken => {
        return token;
      });
    })
    .catch(function(err) {
      console.log('error occured from requestNotifPermission()', err);
      return null;
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
      messaging.onTokenRefresh(function() {
        console.log('refreshed token');
        this.requestNotifPermission(user.uid, messaging);
      });
    }
  };

  getRoomsAndUserConfig = (user) => {
    const { uid } = user;
    return fetch(`${process.env.REACT_APP_HTTP_URL}/getRoomsAndUserConfig`, {
      method: 'POST',
      body: JSON.stringify({ uid })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
  };

  async componentDidMount() {
    this.handleConnection();
    this.firebase.auth()
      .onAuthStateChanged(async user => {
        if (!user) {
          this.firebase.auth().signOut();
          this.updateSession({ onAuthStateChangedError: true });
        } else {
          const roomsAndUserConfig = await this.getRoomsAndUserConfig(user);
          const { userConfig, subscribedRooms } = roomsAndUserConfig;
          this.updateSession({ user, userConfig, subscribedRooms, activeRoom: subscribedRooms[0] });
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
    const sessionValue = {
      updateSession: this.updateSession,
      userConfig: this.state.userConfig,
      subscribedRooms: this.state.subscribedRooms,
      activeRoom: this.state.activeRoom,
      user: this.state.user,
    }
    return (
      <main className='App'>
        <SessionContext.Provider value={sessionValue}>
          <Route
            exact
            path='/'
            component={Splash}
          />
          <Route
            path='/chat'
            render={() => <Chat firebase={this.firebase} />}
          />
          <Route
            path='/signIn'
            render={() => <SignIn firebase={this.firebase} />}
          />
        </SessionContext.Provider>
      </main>
    );
  };

}

export default App;
