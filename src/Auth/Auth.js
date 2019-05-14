import React, { Component } from 'react';

import {reduxForm, Field, focus} from 'redux-form';
import Input from '../Input/Input';
import {required, nonEmpty, matches, length, isTrimmed, email} from '../validators';

import './Auth.css';

const passwordLength = length({min: 6, max: 10});
const matchesPassword = matches('password');

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      register: false,
    };
    this.usersRef = this.props.firebase.database().ref('users');
  }

  registerUser(values) {
    this.props.firebase.auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(res => {
        // console.log('registration complete', res);
        this.setState({registered: true, user: res.user});
        this.props.firebase.auth().currentUser.updateProfile({
          displayName: values.username
        });
        this.props.toggleModal();
      })
      .catch(function(error) {
        const {code, message} = error;
        if (code === "auth/email-already-in-use") {
          // alert(message);
          // return Promise.reject(
          //   new SubmissionError({
          //     ['email']: message
          //   })
          // );
          return alert(error.message);
        }
        // return Promise.reject(
        //   new SubmissionError({
        //     _error: 'Error registering user'
        //   })
        // );
        alert('error submitting form');
    });
  }

  toggleRegistration() {
    this.setState({ register: !this.state.register });
  }

  signInWithEmail(values) {
    const {email, password} = values;
    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('user signed In: ', res);
        // this.setState({
        //   user:
        // });
        this.props.toggleModal();
      })
      .catch(function(error) {
        console.log('error at sugnIn(): ', error);
        alert(error.message)
      });
  }

  signInWithGoogle() {
    this.props.firebase.auth()
      .signInWithPopup( new this.props.firebase.auth.GoogleAuthProvider() )
      .then(res => {
        this.props.toggleModal();
      });
  }

  signOut() {
    this.props.firebase.auth().signOut().then(res => {
      // this.props.toggleModal();
      // this.setState({user: null});
      // this.props.setUser({});
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

  updatePassword(values) {
    const {password} = values;
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
        <form
          className="register-form"
          onSubmit={this.props.handleSubmit(values =>
            this.registerUser(values)
          )}>
          <fieldset>
            <legend>register account</legend>
            {errorMessage}
            <label htmlFor="username">username</label>
            <Field
              component={Input}
              type="text"
              name="username"
              validate={[required, nonEmpty, isTrimmed]}
            />
            <label htmlFor="email">email</label>
            <Field
              component={Input}
              type="email"
              name="email"
              validate={[required, nonEmpty, isTrimmed, email]}
            />
            <label htmlFor="password">password</label>
            <Field
              component={Input}
              type="password"
              name="password"
              validate={[required, passwordLength, isTrimmed]}
            />
            <label htmlFor="passwordConfirm">confirm password</label>
            <Field
              component={Input}
              type="password"
              name="passwordConfirm"
              validate={[required, nonEmpty, matchesPassword]}
            />
            <button
              type="submit"
              disabled={this.props.pristine || this.props.submitting}>
              click here to register
            </button>
          </fieldset>
        </form>
        <button onClick={() => this.toggleRegistration()}>sign in</button>
      </div>
    );
    const signInWithEmailForm = (
      <div>
        <form
          className="login-form"
          onSubmit={this.props.handleSubmit(values =>
            this.signInWithEmail(values)
          )}>
          <fieldset>
            <legend>sign in</legend>
            {errorMessage}
            <label htmlFor="email">email</label>
            <Field
              component={Input}
              type="email"
              name="email"
              validate={[required, nonEmpty, isTrimmed, email]}
            />
            <label htmlFor="password">Password</label>
            <Field
              component={Input}
              type="password"
              name="password"
              validate={[required, passwordLength, isTrimmed]}
            />
            <button
              type="submit"
              disabled={this.props.pristine || this.props.submitting}>
              click here to sign in
            </button>
          </fieldset>
        </form>
        <button onClick={() => this.toggleRegistration()}>sign up</button>
      </div>
    );
    const changePasswordForm = (
      <div>
        <form
          className="updatePassword"
          onSubmit={this.props.handleSubmit(values =>
            this.updatePassword(values)
          )}>
          <fieldset>
            <legend>update password</legend>
            {errorMessage}
            <label htmlFor="password">password</label>
            <Field
              component={Input}
              type="password"
              name="password"
              validate={[required, nonEmpty, isTrimmed, passwordLength]}
            />
            <label htmlFor="confirmEmail">confirm password</label>
            <Field
              component={Input}
              type="password"
              name="confirmEmail"
              validate={[required, nonEmpty, isTrimmed, passwordLength]}
            />
            <button
              type="submit"
              disabled={this.props.pristine || this.props.submitting}>
              click here to update password
            </button>
          </fieldset>
        </form>
      </div>
    );
    const updateDisplayNameForm = (
      <div>
        <form
          className="updateDisplayName"
          onSubmit={this.props.handleSubmit(values =>
            this.updateDisplayName(values)
          )}>
          <fieldset>
            <legend>update display name</legend>
            {errorMessage}
            <label htmlFor="displayName">display name</label>
            <Field
              component={Input}
              type="text"
              name="displayName"
              validate={[required, nonEmpty, isTrimmed]}
            />
            <button
              type="submit"
              disabled={this.props.pristine || this.props.submitting}>
              click here to update display name
            </button>
          </fieldset>
        </form>
      </div>
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

// export default App;

export default reduxForm({
  form: 'registerUser',
  onSubmitFail: (errors, dispatch) => {
    dispatch(focus('registerUser', Object.keys(errors)[0]))
  }
})(Auth);
