import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Chat from './Chat/Chat.js';
import Splash from './Splash/Splash.js';
import SignIn from './SignIn/SignIn.js';
import SessionContext from './SessionContext.js';

class App extends Component {
  state = {
    user: {},
    isNewUser: null,
    inWaiting: null
  };

  updateSession = options => {
    this.setState(options);
  };

  handleConnection = uid => {
    const userStatusDatabaseRef = this.props.firebase.database().ref(`users/${uid}/activity`);
    const isOfflineForDatabase = {
      isOnline: false,
      lastChanged: this.props.firebase.database.ServerValue.TIMESTAMP,
    };
    const isOnlineForDatabase = {
      isOnline: true,
      lastChanged: this.props.firebase.database.ServerValue.TIMESTAMP,
    };
    this.props.firebase.database().ref('.info/connected').on('value', function(snapshot) {
      if (snapshot.val() === false) {
        return;
      };
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    });
  };

  getUserConfig = (user, displayName, controller) => {
    const { uid } = user;
    return fetch(`${process.env.REACT_APP_HTTP_URL}/${controller}`, {
      method: 'POST',
      body: JSON.stringify({ uid, displayName })
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

  requestNotifPermission = uid => {
    let _self = this;
    return this.messaging.requestPermission()
    .then(function() {
      return _self.messaging.getToken();
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

  // this.handleConnection(user.uid);
  // let {userConfig, activeRoom, subscribedRooms} = await this.getUserConfig(user);
  // if (firebase.messaging.isSupported()) {
  //   const messaging = firebase.messaging();
  //   const currentFcmToken = await messaging.getToken();
  //   this.handleFcmToken(currentFcmToken, user.uid, true)
  //   userConfig = Object.assign({}, userConfig, { currentFcmToken });
  //   messaging.onTokenRefresh(function() {
  //     console.log('refreshed token');
  //     this.requestNotifPermission(user.uid);
  //   });
  // }
  // await this.setState({ user, userConfig, activeRoom, isLoading: false, subscribedRooms, messageMode: 'notifications' });

  componentDidMount() {
    // this.props.firebase.auth().signOut();
    const { firebase } = this.props;
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        return this.props.firebase.auth().signOut();
      } else {
        firebase.auth().getRedirectResult()
          .then(result => {
            if (result.credential) {
              const { credential, user } = result;
              const isNewUser = result.additionalUserInfo.isNewUser;
              this.updateSession({user, credential, isNewUser});
            }
          });
      }
    });
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      const stashedEmail = window.localStorage.getItem('emailForSignIn');
      if (stashedEmail) {
        firebase.auth().signInWithEmailLink(stashedEmail, window.location.href)
          .then(function(result) {
            window.localStorage.removeItem('emailForSignIn');
            const { credential, user } = result;
            const isNewUser = result.additionalUserInfo.isNewUser;
            this.updateSession({user, credential, isNewUser, inWaiting: true});
          })
          .catch(function(error) {
            console.log('error');
          });
      } else {
        this.updateSession({user: null, credential: null, inWaiting: true });
      }
    };
  };

  render() {
    const { firebase } = this.props;
    const sessionValue = {
      user: this.state.user,
      isNewUser: this.state.isNew,
      inWaiting: this.state.inWaiting,
      updateSession: this.updateSession
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
            render={() => <Chat firebase={firebase} />}
          />
          <Route
            path='/signIn'
            render={() => <SignIn firebase={firebase} />}
          />
        </SessionContext.Provider>
      </main>
    );
  };

}

export default App;
