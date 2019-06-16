import React from 'react';
import RegistrationForm from './RegistrationForm';
import SignInWithEmailForm from './SignInWithEmailForm';
import VerificationForm from './VerificationForm.js';
// import ChangePasswordForm from './ChangePasswordForm';
// import UpdateDisplayNameForm from './UpdateDisplayNameForm';
import Modal from '../Modal/Modal.js';
import SessionContext from '../SessionContext.js';
import './Auth.css';

class Auth extends React.Component {

  static defaultProps = {
    session: {},
    updateSession: () => {}
  };
  static contextType = SessionContext;

  state = {
    user: null,
    isRegistrationMode: false
  }

  toggleAuthModal = () => {
    this.props.toggleAuthModal();
  }

  signInWithEmail = (email, password) => {
    // this.props.firebase.auth().signInWithEmailAndPassword(email, password)
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

  // firebase.auth().currentUser
  //   .linkAndRetrieveDataWithCredential(credential)
  //   .then(usercred => {
  //     user = usercred.user;
  //     console.log("Account linking success", user);
  //     loadApp(user, credential, isNew, email, firebase, displayNameValue);
  //   }, function(error) {
  //     console.log("Account linking error", error);
  //     firebase.auth().signOut()
  //   });
  //
  // firebase.auth().signInWithEmailLink(email, window.location.href)
  //   .then(result => {
  //     const user = result.user;
  //     const isNew = result.additionalUserInfo.isNewUser;
  //     const credential = firebase.auth.EmailAuthProvider.credential(email, passwordValue);
  //     this.setAuthSession({ user, credential, isNew, apiLKey, stashedEmail });
  //   })
  //   .catch(error => {
  //     this.setError({ error });
  //   });

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

  // verifyCredentials = (displayNameValue, emailValue, passwordValue) => {
  //   const { email, loadApp, isNew, firebase } = this.props;
  //   if (emailValue !== email) {
  //     alert('Incorrect email.');
  //   } else {
  //     firebase.auth().signInWithEmailLink(email, window.location.href)
  //       .then(result => {
  //         let user = result.user;
  //         const isNew = result.additionalUserInfo.isNewUser;
  //         const credential = firebase.auth.EmailAuthProvider.credential(email, passwordValue);
  //         firebase.auth().currentUser
  //           .linkAndRetrieveDataWithCredential(credential)
  //           .then(usercred => {
  //             user = usercred.user;
  //             console.log("Account linking success", user);
  //             loadApp(user, credential, isNew, email, firebase, displayNameValue);
  //           }, function(error) {
  //             console.log("Account linking error", error);
  //             firebase.auth().signOut()
  //           });
  //       })
  //       .catch(error => {
  //         console.error(error.code);
  //         firebase.auth().signOut();
  //       });
  //   }
  // };

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

// export default React.forwardRef((props, ref) => (
//   <SessionContext.Consumer>
//     {session => <Auth {...props} theme={session} ref={ref} />}
//   </SessionContext.Consumer>
// ));
