import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import Auth from './Auth/Auth';
import Modal from './Modal/Modal';

import Messages from './Messages/Messages';
import RoomList from './RoomList/RoomList';
import SubmitMessage from './SubmitMessage/SubmitMessage';
import Splash from './Splash/Splash';

import {reduxForm, focus} from 'redux-form';

const config = {
  apiKey: "AIzaSyAgvoGPD9Rh1p1Pf0TxHTdPGunB_KR9OqQ",
  authDomain: "chat-asdf.firebaseapp.com",
  databaseURL: "https://chat-asdf.firebaseio.com",
  projectId: "chat-asdf",
  storageBucket: "chat-asdf.appspot.com",
  messagingSenderId: "145747598382"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.requestPermission()
  .then(function() {
    console.log('have permission');
    return messaging.getToken();
  })
  .then(function(token) {
    // here is where the token is sent to the server.
    console.log('message token: ', token);
  })
  .catch(function(err) {
    console.log('error occured');
  });
messaging.onMessage(function(payload) {
  console.log('onMessage', payload);
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: null,
      userConfig: null,
      user: null,
      show: false,
      showMenu: true,
      newNameText: ''
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const userConfig = await this.getUserConfig(user.uid);
        const lastVisitedRoom = await this.getLastVisitedRoom(userConfig.lastVisited);
        this.setState({ user, userConfig, activeRoom: lastVisitedRoom });
      } else {
        this.setState({ user });
      }
    })
  }

  getUserConfig(uid) {
    return new Promise((resolve, reject) => {
      const userConfigRef = firebase.database().ref(`users/${uid}`);
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
      const lastVisitedRoomRef = firebase.database().ref(`rooms/${lastRoomId}`);
      if (!lastVisitedRoomRef) {
        reject(new Error('room does not exist for user'), null);
      }
      lastVisitedRoomRef.on('value', snapshot => {
        const lastVisitedRoom = snapshot.val();
        lastVisitedRoom.key = snapshot.key;
        resolve(lastVisitedRoom);
      });
    });
  }

  setActiveRoom(activeRoom) {
    this.setState({ activeRoom });
  }

  handleNameChange = (event) => {
    if (event.target.value.length >= 35) {
      alert("Please enter some text between 1 and 20 characters in length. :)");
      return;
    } else {
      this.setState({
        newNameText: event.target.value
      });
    }
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
            firebase={firebase}
            activeRoom={this.state.activeRoom}
            user={this.state.user}
            userConfig={this.state.userConfig}
            setActiveRoom={this.setActiveRoom.bind(this)}
          />
        </aside>
        <main className={!this.state.showMenu ? "main" : "main overflowHidden"}>
          <Messages firebase={firebase}
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
            firebase={firebase}
          />
        </footer>
      </div>
    );
    const splash = (
      <div>
        <Splash />
        <img src={require("./assets/images/potato2.svg")}
             alt="potato logo"
             onClick={this.toggleModal}
        />
      </div>
    );
    return (
      <div>
        {this.state.user ? app : splash}
        <Modal show={this.state.show}
               handleClose={this.toggleModal}>
          <Auth firebase={firebase}
                toggleModal={this.toggleModal.bind(this)}
                user={this.state.user}
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
