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
    this.usersRef = firebase.database().ref('users');
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user}, () => {
        this.setUserConfig(user.uid);
      });
      if (user) this.setUserConfig(user.uid);
    });
  }

  setUserConfig(uid) {
    this.usersRef.on('child_added', snapshot => {
      if (snapshot.key === uid) {
        this.setState({userConfig: snapshot.val()}, () => {
          this.setActiveRoom(snapshot.val().lastVisited);
        });
        // this.getLastVisitedandSetActiveRoom(snapshot.key);
      }
    });
  }

  setActiveRoom(roomId) {
    const activeRommRef = firebase.database().ref(`rooms/${roomId}`);
    activeRommRef.once('value').then(snapshot => {
      const activeRoomWithKey = snapshot.val();
      activeRoomWithKey['key'] = snapshot.key;
      this.setState({ activeRoom: activeRoomWithKey });
    });
  }

  // getLastVisitedandSetActiveRoom(roomId) {
  //   this.roomsRef.on('child_added', snapshot => {
  //     if (snapshot.key === roomId) {
  //       this.setRoom(snapshot.val());
  //     }
  //   });
  // }

  // setRoom(room) {
  //   this.setState({ activeRoom: room });
  // }

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
