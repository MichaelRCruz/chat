import React from 'react';
import RegistrationForm from './RegistrationForm';
import SignInWithEmailForm from './SignInWithEmailForm';
// import ChangePasswordForm from './ChangePasswordForm';
// import UpdateDisplayNameForm from './UpdateDisplayNameForm';
import UserProfile from './UserProfile';
import './Auth.css';

class Auth extends React.Component {
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
    let _self = this;
    this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(res => {
      this.setState({isRegistrationMode: true, user: res.user}, () => {
        _self.props.firebase.auth().currentUser.updateProfile({ displayName });
        _self.props.toggleModal();
        // _self.props.toggleRegistrationMode(false);
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
    if (!this.props.user) {
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
