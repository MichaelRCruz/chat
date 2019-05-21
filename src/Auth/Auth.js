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
    this.usersRef = this.props.firebase.database().ref('users');
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

  toggleRegistration() {
    this.setState({ register: !this.state.register });
  }

  signInWithEmail(email, password) {
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

  signInWithGoogle() {
    this.props.firebase.auth()
      .signInWithRedirect( new this.props.firebase.auth.GoogleAuthProvider() )
      .then(res => {
        this.props.toggleModal();
      });
  }

  signOut() {
    this.props.firebase.auth().signOut().then(res => {
      this.props.toggleModal();
    });
  }

  deleteUser() {
    const user = this.props.firebase.auth().currentUser;
    user.delete().then(res => {
      console.log('deleted user: ', res);
      this.props.toggleModal();
    }).catch(function(error) {
      console.log('error in deleting user: ', error);
      alert(error);
    });
  }

  sendEmailVerification() {
    var user = this.props.firebase.auth().currentUser;
    user.sendEmailVerification().then(res => {
      this.props.toggleModal();
    }).catch(function(error) {
      alert(error.message);
    });
  }

  updatePassword(password) {
    var user = this.props.firebase.auth().currentUser;
    user.updatePassword(password).then(res => {
      this.props.toggleModal();
      alert('password updated successfully: ');
    }).catch(error => {
      alert(error);
    });
  }

  updateDisplayName(values) {
    const {displayName} = values;
    var user = this.props.firebase.auth().currentUser;
    user.updateProfile({
      displayName
    }).then(res => {
      alert('display name updated');
      this.props.toggleModal();
    }).catch(function(error) {
      alert(error.messsage);
    });
  }

  render() {
    let successMessage;
    if (this.props.submitSucceeded) {
      successMessage = (
        <div className="message message-success">
          Registration submitted successfully to server.
        </div>
      );
    }

    let errorMessage;
    if (this.props.error) {
      errorMessage = (
        <div className="message message-error">{this.props.error}</div>
      );
    }
    const registrationForm = (
      <div>
        <RegistrationForm registerUser={this.registerUser.bind(this)} />
        <button onClick={() => this.toggleRegistration()}>sign in</button>
      </div>
    );
    const signInWithEmailForm = (
      <div>
        <SignInWithEmailForm signInWithEmail={this.signInWithEmail.bind(this)} />
        <button onClick={() => this.toggleRegistration()}>sign up</button>
      </div>
    );
    const changePasswordForm = (
      <ChangePasswordForm updatePassword={this.updatePassword.bind(this)}/>
    );
    const updateDisplayNameForm = (
      <UpdateDisplayNameForm updateDisplayName={this.updateDisplayName.bind(this)}/>
    );
    const googleButton = (
      <div className="on-off-button"
         onClick={this.signInWithGoogle.bind(this)}>
        <i className="material-icons">power_settings_new</i>
        <p>continue with Google</p>
      </div>
    );
    const signOutButton = (
      <button onClick={() => this.signOut()}>click here to sign out</button>
    );
    const deleteUserButton = (
      <button onClick={() => this.deleteUser()}>click here to delete account</button>
    );
    const emailVerificationButton = (
      <button onClick={() => this.sendEmailVerification()}>click here to send verification email</button>
    );
    if (!this.props.user) {
      return (
        <section className="authComponent">
          {this.state.register ? registrationForm : signInWithEmailForm}
          {googleButton}
        </section>
      );
    } else {
      return (
        <div>
          {changePasswordForm}
          {updateDisplayNameForm}
          {signOutButton}
          {emailVerificationButton}
          {deleteUserButton}
        </div>
      );
    }
  }
}

export default Auth;

// export default reduxForm({
//   form: 'registerUser2',
//   onSubmitFail: (errors, dispatch) => {
//     dispatch(focus('registerUser2', Object.keys(errors)[0]))
//   }
// })(Auth);
