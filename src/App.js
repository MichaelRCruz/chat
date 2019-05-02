import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import Modal from './Modal/Modal';

import Messages from './Messages/Messages';
import RoomList from './RoomList/RoomList';
import SubmitMessage from './SubmitMessage/SubmitMessage';

import {reduxForm, Field, focus} from 'redux-form';
import Input from './Input/Input.js';
import {required, nonEmpty, email, matches} from './validators.js';

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
      user: null,
      show: false,
      showMenu: true,
      newNameText: ''
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
    // this.setState({user: {
    //   email: null,
    //   displayName: name,
    //   photoURL: null
    // }});
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
    let successMessage;
    if (this.props.submitSucceeded) {
        successMessage = (
            <div className="message message-success">
                Message submitted successfully
            </div>
        );
    }

    let errorMessage;
    if (this.props.error) {
        errorMessage = (
            <div className="message message-error">{this.props.error}</div>
        );
    }
    return (
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
            setRoom={this.setRoom.bind(this)}
            user={this.state.user}
          />
        </aside>
        <main className={!this.state.showMenu ? "main" : "main overflowHidden"}>
          <Messages firebase={firebase} activeRoom={this.state.activeRoom} user={this.state.user} />
        </main>
        <footer className="footer">
          <SubmitMessage
            activeRoom={this.state.activeRoom}
            user={this.state.user}
            firebase={firebase}
          />
        </footer>
        <Modal show={this.state.show}
               handleClose={this.toggleModal}>
          <section>
              <form
                  onSubmit={this.props.handleSubmit(values =>
                      this.createName(values)
                  )}>
                  {successMessage}
                  {errorMessage}
                <Field
                    name="username"
                    type="text"
                    component={Input}
                    label="username"
                    validate={[required, nonEmpty]}
                />
                <Field
                    name="password"
                    type="password"
                    component={Input}
                    label="password"
                    validate={[required, nonEmpty]}
                />
                <Field
                    name="passwordConfirm"
                    type="password"
                    component={Input}
                    label="passwordConfirm"
                    validate={[required, nonEmpty]}
                />
                <button type="submit" className="submitName" disabled={
                    this.props.pristine || this.props.submitting
                }>
                  <i className="material-icons">add</i>
                </button>
              </form>
          </section>
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
