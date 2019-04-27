import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

import Messages from './Messages/Messages';
import RoomList from './RoomList/RoomList';
import SubmitMessage from './SubmitMessage/SubmitMessage';

import defaultUserImage from './assets/images/peaceful_potato.png';

const config = {
  apiKey: "AIzaSyAgvoGPD9Rh1p1Pf0TxHTdPGunB_KR9OqQ",
  authDomain: "chat-asdf.firebaseapp.com",
  databaseURL: "https://chat-asdf.firebaseio.com",
  projectId: "chat-asdf",
  storageBucket: "chat-asdf.appspot.com",
  messagingSenderId: "145747598382"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: null,
      user: null
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged( user => {
      this.setUser(user);
      // var onComplete = function(error) {
      //   if (error) {
      //     console.log('Operation failed');
      //   } else {
      //     console.log(' Operation completed');
      //   }
      // };
      // this.usersRef.push(user.providerData[0]);
      // console.log(+user.providerData[0].uid, user.providerData[0]);
      // this.usersRef.child(user.providerData[0].uid).setValue(user.providerData[0], onComplete);
      // this.usersRef.orderByChild("uid").equalTo(user.providerData[0].uid).on("add_child", function(snapshot) {
      //   console.log('snapshot.val()', snapshot.val());
      //   if (!snapshot.val()) {
      //     this.usersRef.push(user.providerData[0]);
      //   } else {
      //
      //   }
      // });
    });
  }

  setUser(user) {
    this.setState({ user });
  }

  setRoom(room) {
    this.setState({ activeRoom: room });
  }

  signIn() {
    firebase.auth().signInWithPopup( new firebase.auth.GoogleAuthProvider() );
  }

  signOut() {
    firebase.auth().signOut();
  }

  render() {
    return (
      <div className="appComponent">
        <header className="header">
          <img className="logo" src={require("./assets/images/potato2.svg")} />
          <p className="app-name">Potato</p>
          <div className="on-off-button"
               onClick={ this.state.user ?
                 () => this.signOut() : this.signIn.bind(this) }>
            <i className="material-icons">power_settings_new</i>
            <p>Sign { this.state.user ? 'out' : 'in' }</p>
          </div>
        </header>
        <aside className="sidebar">
          <RoomList
            firebase={firebase}
            activeRoom={this.state.activeRoom}
            setRoom={this.setRoom.bind(this)}
            user={this.state.user}
          />
        </aside>
        <main className="main">
          <Messages firebase={firebase} activeRoom={this.state.activeRoom} user={this.state.user} />
        </main>
        <footer className="footer">
          <SubmitMessage
            activeRoom={this.state.activeRoom}
            user={this.state.user}
            firebase={firebase}
          />
        </footer>
      </div>
    );
  }
}

export default App;
