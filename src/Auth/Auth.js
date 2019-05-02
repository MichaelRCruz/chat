import React, { Component } from 'react';

import {reduxForm, Field} from 'redux-form';
import Input from '../Input/Input';
import {required, nonEmpty, matches, length, isTrimmed, email} from '../validators';

const passwordLength = length({min: 10, max: 72});
const matchesPassword = matches('password');

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      errorMessage: null,
    };
  }

  registerUser(values) {
    this.props.firebase.auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(res => {
        console.log('registration complete', res);
        this.signIn(values.email, values.password);
      })
      .catch(function(error) {
        console.log(error);
        const {code} = error;
        if (code === "auth/email-already-in-use") {
          alert('email already in use');
          // Convert ValidationErrors into SubmissionErrors for Redux Form
          // return Promise.reject(
          //   new SubmissionError({
          //       ['auth/email-already-in-use']: message
          //   })
          // );
        }
        // return Promise.reject(
        //     new SubmissionError({
        //         _error: 'Error submitting message'
        //     })
        // );
    }).bind(this);
  }

  signIn(email, password) {
    this.props.firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('user signed In: ', res);
        this.props.toggleModal();
      })
      .catch(function(error) {
        console.log('error at sugn in: ', error);
      });
  }

  signOut() {
    this.props.firebase.auth().signOut();
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
      <section>
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
                  Register
              </button>
          </form>
      </section>
    );
  }
}

// export default App;

export default reduxForm({
    form: 'contact',
    onSubmitFail: (errors, dispatch) =>
        console.log('email already taken', errors)
})(Auth);
