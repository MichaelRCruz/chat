import React, { Component } from 'react';
import RegistrationForm from './RegistrationForm';
import SignInWithEmailForm from './SignInWithEmailForm';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateDisplayNameForm from './UpdateDisplayNameForm';

import './Auth.css';

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      register: false,
    };
  }

  registerUser = (displayName, email, password) => {
    this.props.firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.setState({registered: true, user: res.user});
        this.props.firebase.auth().currentUser.updateProfile({
          displayName
        });
        this.props.toggleModal();
      })
      .catch(function(error) {
        const {code, message} = error;
        if (code === "auth/email-already-in-use") {
          return alert(error.message);
        }
        alert('error submitting form');
    });
  }

  toggleRegistration = () => {
    this.setState({ register: !this.state.register });
  }

  signInWithEmail = (email, password) => {
    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('user signed In: ', res);
        this.props.toggleModal();
      })
      .catch(function(error) {
        console.log('error at sugnIn(): ', error);
        alert(error.message)
      });
  }

  signInWithGoogle = () => {
    this.props.firebase.auth()
      .signInWithRedirect( new this.props.firebase.auth.GoogleAuthProvider() )
      .then(res => {
        this.props.toggleModal();
      });
  }

  signOut = () => {
    const {userConfig} = this.props;
    this.props.firebase.auth().signOut().then(res => {
      return;
    });
  }

  deleteUser = () => {
    const user = this.props.firebase.auth().currentUser;
    user.delete().then(res => {
      console.log('deleted user: ', res);
      this.props.toggleModal();
    }).catch(function(error) {
      console.log('error in deleting user: ', error);
      alert(error);
    });
  }

  sendEmailVerification = () => {
    var user = this.props.firebase.auth().currentUser;
    user.sendEmailVerification().then(res => {
      this.props.toggleModal();
    }).catch(function(error) {
      alert(error.message);
    });
  }

  requestNotifPermission = () => {
    this.props.requestNotifPermission(this.props.user.uid);
  }

  updatePassword = password => {
    var user = this.props.firebase.auth().currentUser;
    user.updatePassword(password).then(res => {
      this.props.toggleModal();
      alert('password updated successfully: ');
    }).catch(error => {
      alert(error);
    });
  }

  updateDisplayName = displayName => {
    var user = this.props.firebase.auth().currentUser;
    user.updateProfile({
      displayName
    }).then(res => {
      console.log(res);
      this.props.toggleModal();
    }).catch(function(error) {
      alert(error.messsage);
    });
  }

  sendNotification = () => {
    return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/sendMessageToTopic`, {
      method: 'post',
      body: JSON.stringify({
        message: 'Hello, world.',
        uid: this.props.user.uid
      })
    }).then(function(response) {
      return response;
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    const registrationForm = (
      <div>
        <RegistrationForm registerUser={this.registerUser.bind(this)} />
        <button onClick={() => this.toggleRegistration()}>sign in</button>
      </div>
    );
    const signInWithEmailForm = (
      <SignInWithEmailForm signInWithEmail={this.signInWithEmail.bind(this)} />
    );
    const deleteUserButton = (
      <button onClick={() => this.deleteUser()}>click here to delete account</button>
    );
    const emailVerificationButton = (
      <button onClick={() => this.sendEmailVerification()}>
        click here to send verification email
      </button>
    );
    if (!this.props.user) {
      return (
        <section className="authComponent">
          {this.state.register ? registrationForm : signInWithEmailForm}
          <div className="googleButton" onClick={this.signInWithGoogle.bind(this)}>
            <i className="material-icons">power_settings_new</i>
            <p>continue with Google</p>
          </div>
        </section>
      );
    } else {
      return (
        <div>
          <ChangePasswordForm updatePassword={this.updatePassword.bind(this)}/>
          <UpdateDisplayNameForm updateDisplayName={this.updateDisplayName.bind(this)}/>
          <button onClick={() => this.signOut()}>click here to sign out</button>
          {emailVerificationButton}
          {deleteUserButton}
          <button onClick={() => this.requestNotifPermission()}>
            click here to authorize notifications
          </button>
          <button onClick={() => this.sendNotification()}>
            click here to send a test message to all your signed in devices
          </button>
        </div>
      );
    }
  }
}

export default Auth;
