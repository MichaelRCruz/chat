import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

import Messages from './Messages/Messages';
import RoomList from './RoomList/RoomList';
import User from './User/User';

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
    console.log(this.state.user);
  }

  setUser(user) {
    this.setState({ user });
  }

  setRoom(room) {
    this.setState({ activeRoom: room });
  }

  render() {
    return (
      <div className="App">
        <nav id="main">
          <User firebase={firebase} setUser={this.setUser.bind(this)} user={this.state.user} />
        </nav>

        <aside id="sidebar">
          <RoomList firebase={firebase} activeRoom={this.state.activeRoom} setRoom={this.setRoom.bind(this)} user={this.state.user} />
        </aside>

        <Messages firebase={firebase} activeRoom={this.state.activeRoom} user={this.state.user} />
      </div>
    );
  }
}

export default App;
