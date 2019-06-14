import React from 'react';
import RegistrationForm from './RegistrationForm';
import SignInWithEmailForm from './SignInWithEmailForm';
import VerificationForm from './VerificationForm.js';
// import ChangePasswordForm from './ChangePasswordForm';
// import UpdateDisplayNameForm from './UpdateDisplayNameForm';
import UserProfile from './UserProfile';
import './Auth.css';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isRegistrationMode: false,
    }
  };

  signInWithEmail = (email, password) => {
    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
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

  registerUser = (displayName, email, password) => {
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: `${process.env.REACT_APP_CONTINUE_URL}/`,
      // This must be true.
      handleCodeInApp: true,
      dynamicLinkDomain: 'coolpotato.net'
    };
    this.props.firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
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

  verifyCredentials = (displayNameValue, emailValue, passwordValue) => {
    const { email, firebase, isNew, loadApp, user } = this.props;
    if (displayNameValue !== email && user.email !== displayNameValue) {

    }
    const credential = firebase.auth.EmailAuthProvider.credential(email, passwordValue);
    this.props.firebase.auth().currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(usercred => {
        let user = usercred.user;
        console.log("Account linking success", user);
        loadApp(user, null, displayNameValue, isNew);
      }, function(error) {
        console.debug("Account linking error", error);
      });
  }

  render() {
    const { isNew } = this.props;
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
    if (isNew) {
      return (
        <VerificationForm
          verifyCredentials={this.verifyCredentials.bind(this)}
          toggleRegistrationMode={this.toggleRegistrationMode.bind(this)}
        />
      );
    } else if (!this.props.user) {
      return (
        this.state.isRegistrationMode ? registrationForm : signInWithEmailForm
      );
    } else {
      return (
        <UserProfile
          firebase={this.props.firebase}
          toggleModal={this.props.toggleModal}
          handleFcmToken={this.props.handleFcmToken}
          userConfig={this.props.userConfig}
        />
      );
    }
  }
}

export default Auth;
