import React, { Component } from 'react';
import './App.css';
import Auth from './Auth/Auth';
import Modal from './Modal/Modal';

import Messages from './Messages/Messages';
import RoomList from './RoomList/RoomList';
import SubmitMessage from './SubmitMessage/SubmitMessage';
import Splash from './Splash/Splash';

import {reduxForm, focus} from 'redux-form';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: null,
      onlineUsers: [],
      show: false,
      showMenu: true,
      user: null,
      userConfig: null
    };
    this.myRef = React.createRef();
    this.firebase = this.props.firebase;
    this.messaging = !this.props.isSafari ? this.props.firebase.messaging() : null;
  }

  componentDidMount() {
    this.firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.handleConnection(user.uid);
        const fcmToken = await this.requestNotifPermission(user.uid);
        const userConfig = await this.getUserConfig(user.uid);
        const userConfigWithToken = Object.assign({}, userConfig, {fcmToken});
        const lastVisitedRoom = await this.getLastVisitedRoom(userConfig.lastVisited);
        this.messaging.onTokenRefresh(function() {
          console.log('refreshed token');
          this.requestNotifPermission();
        });
        this.setState({ user, userConfig: userConfigWithToken, activeRoom: lastVisitedRoom });
      } else {
        this.setState({ user });
      }
    });
  }

  handleConnection(uid) {
    // https://firebase.google.com/docs/database/web/read-and-write#detach_listeners
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
      if (snapshot.val() == false) {
        return;
      };
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
          userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    });
  }

  requestNotifPermission = uid => {
    if (!this.props.isSafari) {
      let _self = this;
      return this.messaging.requestPermission()
        .then(function() {
          return _self.messaging.getToken();
        }).then(token => {
          return this.handleFcmToken(token, uid, true)
            .then(fcmToken => {
              return token;
            });
        })
        .catch(function(err) {
          console.log('error occured from requestNotifPermission()', err);
          return null;
        });
    } else {
      return null;
    }
  }

  handleFcmToken = (fcmToken, uid, subscription) => {
    return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/addTokenToTopic`, {
      method: 'POST',
      body: JSON.stringify({ fcmToken, uid })
    }).then(function(response) {
      return response;
    }).catch(error => {
      console.log(error);
    });
  }

  setFcmToken = fcmToken => {
    console.log('fcmToken: ', fcmToken);
  }

  getUserConfig(uid) {
    return new Promise((resolve, reject) => {
      const userConfigRef = this.firebase.database().ref(`users/${uid}`);
      if (!userConfigRef) {
        reject(new Error('config does not exist for user'), null);
      }
      userConfigRef.on('value', snapshot => {
        resolve(snapshot.val());
      });
    });
  }

  getLastVisitedRoom(lastRoomId) {
    return new Promise((resolve, reject) => {
      const lastVisitedRoomRef = this.firebase.database().ref(`rooms/${lastRoomId}`);
      const usersRef = this.firebase.database().ref(`users`);
      if (!lastVisitedRoomRef) {
        reject(new Error('room does not exist for user'), null);
      }
      lastVisitedRoomRef.once('value', snapshot => {
        const lastVisitedRoom = snapshot.val();
        lastVisitedRoom.key = snapshot.key;
        resolve(lastVisitedRoom);
      });
    });
  }

  setActiveRoom(activeRoom) {
    this.setState({ activeRoom });
  }

  createName = (values) => {
    console.log('email form wired up and validated: ', values);
  }

  toggleModal = () => {
    this.setState({
      show: !this.state.show
    });
  }

  toggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu
    });
  }

  render() {
    const app = (
      <div className="appComponent">
        <header className="header">
          <img className="logo" src={require("./assets/images/potato2.svg")}
               alt="potato logo"
               onClick={ true ?
                 () => this.toggleMenu() : () => this.toggleMenu()}
          />
          <p className="app-name">Potato</p>
          <i className="material-icons loginModal" onClick={this.toggleModal}>more_vert</i>

        </header>
        <aside className={this.state.showMenu ? "sidebar" : "displayUnset"}>
          <RoomList
            className="lightContainer"
            firebase={this.firebase}
            activeRoom={this.state.activeRoom}
            user={this.state.user}
            userConfig={this.state.userConfig}
            setActiveRoom={this.setActiveRoom.bind(this)}
          />
        </aside>
        <main className={!this.state.showMenu ? "main" : "main overflowHidden"}>
          <Messages firebase={this.firebase}
                    activeRoom={this.state.activeRoom}
                    user={this.state.user}
                    userConfig={this.state.userConfig}
          />
        </main>
        <footer className="footer">
          <SubmitMessage
            userConfig={this.state.userConfig}
            activeRoom={this.state.activeRoom}
            user={this.state.user}
            firebase={this.firebase}
          />
        </footer>
      </div>
    );
    const splash = (
      <div>
        <img src={require("./assets/images/potato2.svg")}
             alt="potato logo"
             onClick={this.toggleModal}
        />
        <Splash />
      </div>
    );
    return (
      <div>
        {this.state.user ? app : splash}
        <Modal show={this.state.show}
               handleClose={this.toggleModal}>
          <Auth firebase={this.firebase}
                toggleModal={this.toggleModal.bind(this)}
                user={this.state.user}
                userConfig={this.state.userConfig}
                requestNotifPermission={this.requestNotifPermission.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}

// export default App;

export default reduxForm({
    form: 'contact',
    onSubmitFail: (errors, dispatch) =>
        dispatch(focus('contact', Object.keys(errors)[0]))
})(App);
