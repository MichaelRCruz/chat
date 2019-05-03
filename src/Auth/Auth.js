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
      registered: null,
    };
  }

  registerUser(values) {
    this.props.firebase.auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(res => {
        console.log('registration complete', res);
        this.setState({registered: true, user: res.user});
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

  signIn(email, password) {
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
      this.props.toggleModal();
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
    return (
      <section className="authComponent">
        <form
          className="login-form"
          onSubmit={this.props.handleSubmit(values =>
            this.registerUser(values)
          )}>
          {successMessage}
          {errorMessage}
          <label htmlFor="username">Username</label>
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
          <label htmlFor="password">Password</label>
          <Field
            component={Input}
            type="password"
            name="password"
            validate={[required, passwordLength, isTrimmed]}
          />
          <label htmlFor="passwordConfirm">Confirm password</label>
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
        </form>
        <div className="on-off-button"
           onClick={this.signInWithGoogle.bind(this)}>
          <i className="material-icons">power_settings_new</i>
          <p>continue with Google</p>
        </div>
        <button onClick={() => this.signOut()}>click here to sign out</button>
      </section>
    );
  }
}

// export default App;

export default reduxForm({
    form: 'registerUser',
    onSubmitFail: (errors, dispatch) => {
      dispatch(focus('registerUser', Object.keys(errors)[0]))
    }
})(Auth);
