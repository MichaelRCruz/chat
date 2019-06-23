import React from 'react';
import RegistrationForm from './RegistrationForm';
import SignInWithEmailForm from './SignInWithEmailForm';
import VerificationForm from './VerificationForm.js';
import Modal from '../Modal/Modal.js';
import SessionContext from '../SessionContext.js';
import * as firebase from 'firebase';
import './Auth.css';

class Auth extends React.Component {

  state = {
    user: null,
    isRegistrationMode: false
  }

  toggleAuthModal = () => {
    this.props.toggleAuthModal();
  }

  signInWithEmail = (email, password) => {
    // firebase.auth().signInWithEmailAndPassword(email, password)
    // .then(res => {
    //   this.props.toggleModal();
    // })
    // .catch(function(error) {
    //   console.log('error at signIn(): ', error);
    //   alert(error.message)
    // });
    console.log('kwjekdj');
    this.context.updateSession({user: 'mykey'})
  };

  signInWithGoogle = () => {
    firebase.auth()
    .signInWithRedirect( new firebase.auth.GoogleAuthProvider() )
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

  registerUser = (displayName, email, password) => {
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: `${process.env.REACT_APP_CONTINUE_URL}/`,
      // This must be true.
      handleCodeInApp: true,
      dynamicLinkDomain: 'coolpotato.net'
    };
    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('asdfChatEmailForSignIn', email);
        this.props.renderWaitingRoom();
        this.props.toggleModal();
      })
      .catch(error => {
        this.props.renderWaitingRoom();
        this.props.toggleModal();
        console.log(error.code);
      });
  };

  toggleRegistrationMode = isRegistrationMode => {
    this.setState({ isRegistrationMode });
  };

  static contextType = SessionContext;
  render() {
    const { user } = this.context;
    const registrationForm = (
      <RegistrationForm
        registerUser={this.registerUser.bind(this)}
        signInWithGoogle={this.signInWithGoogle.bind(this)}
        toggleRegistrationMode={this.toggleRegistrationMode.bind(this)}
      />
    );
    const signInWithEmailForm = (
      <SignInWithEmailForm
        signInWithEmail={this.signInWithEmail.bind(this)}
        signInWithGoogle={this.signInWithGoogle.bind(this)}
        toggleRegistrationMode={this.toggleRegistrationMode.bind(this)}
      />
    );
    return (
      <Modal
        title="settings"
        show={true}
        children={this.state.isRegistrationMode ? registrationForm : signInWithEmailForm}
        handleClose={this.toggleAuthModal.bind(this)}>
      </Modal>
    );
  };

}

export default Auth;
