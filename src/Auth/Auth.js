import React, { Component, Fragment } from 'react';
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
      isRegistrationMode: false
    }
  };

  signInWithEmail = (email, password) => {
    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
      console.log('user signed In: ', res);
      this.props.toggleModal();
    })
    .catch(function(error) {
      console.log('error at signIn(): ', error);
      alert(error.message)
    });
  };

  signInWithGoogle = () => {
    this.props.firebase.auth()
    .signInWithRedirect( new this.props.firebase.auth.GoogleAuthProvider() )
    .then(() => {
      this.props.toggleModal();
      this.toggleRegistrationMode(false);
    });
  };

  signOut = async () => {
    const { firebase, userConfig } = this.props;
    const uid = await firebase.auth().currentUser.uid;
    firebase.auth().signOut()
    .then(() => {
      if (userConfig.currentFcmToken) {
        return this.props.handleFcmToken(userConfig.currentFcmToken, uid, false);
      }
    });
  };

  deleteUser = () => {
    const user = this.props.firebase.auth().currentUser;
    user.delete()
    .then(res => {
      console.log('deleted user: ', res);
      this.props.toggleModal();
    })
    .catch(function(error) {
      console.log('error in deleting user: ', error);
      alert(error);
    });
  };

  sendEmailVerification = () => {
    const user = this.props.firebase.auth().currentUser;
    user.sendEmailVerification()
    .then(res => {
      this.props.toggleModal();
    })
    .catch(function(error) {
      console.log(error.message);
    });
  };

  requestNotifPermission = () => {
    this.props.requestNotifPermission(this.props.user.uid);
  };

  updatePassword = password => {
    var user = this.props.firebase.auth().currentUser;
    user.updatePassword(password)
    .then(res => {
      this.props.toggleModal();
      alert('password updated successfully: ');
    })
    .catch(error => {
      alert(error);
    });
  };

  updateDisplayName = displayName => {
    var user = this.props.firebase.auth().currentUser;
    user.updateProfile({ displayName })
    .then(res => {
      console.log(res);
      this.props.toggleModal();
    })
    .catch(error => {
      alert(error.messsage);
    });
  };

  registerUser = (displayName, email, password) => {
    let _self = this;
    this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(res => {
      this.setState({isRegistrationMode: true, user: res.user}, () => {
        _self.props.firebase.auth().currentUser.updateProfile({ displayName });
        _self.props.toggleModal();
      });
    })
    .catch(error => {
      const { code } = error;
      if (code === "auth/email-already-in-use") {
        return alert(error.message);
      }
    });
  };

  toggleRegistrationMode = isRegistrationMode => {
    this.setState({ isRegistrationMode });
  };

  render() {
    const registrationForm = (
      <RegistrationForm
        registerUser={this.registerUser.bind(this)}
        signInWithGoogle={this.signInWithGoogle.bind(this)}
      />
    );
    const signInWithEmailForm = (
      <SignInWithEmailForm
        signInWithEmail={this.signInWithEmail.bind(this)}
        signInWithGoogle={this.signInWithGoogle.bind(this)}
      />
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
        this.state.isRegistrationMode ? registrationForm : signInWithEmailForm
      );
    } else {
      return (
        <React.Fragment>
          <ChangePasswordForm updatePassword={this.updatePassword.bind(this)}/>
          <UpdateDisplayNameForm updateDisplayName={this.updateDisplayName.bind(this)}/>
          <button onClick={() => this.signOut()}>click here to sign out</button>
          {emailVerificationButton}
          {deleteUserButton}
          <button onClick={() => this.requestNotifPermission()}>
            click here to authorize notifications
          </button>
        </React.Fragment>
      );
    }
  }
}

export default Auth;
