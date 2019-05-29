import React, { Component } from 'react';
import Validation from '../validation.js';

import './SignInWithEmailForm.css';

class SignInWithEmailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
      passwordValue: '',
      emailError: '',
      passwordError: '',
      formValid: false
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const { emailValue, passwordValue } = this.state;
    this.props.signInWithEmail(emailValue, passwordValue);
  }

  formValid = () => {
    const {emailValue, passwordValue, emailError, passwordError} = this.state;
    const hasErrors = emailError.length || passwordError.length ? true : false;
    const hasValues = emailValue.length && passwordValue.length;
    this.setState({
      formValid: !hasErrors && hasValues
    });
  }

  handleFieldValue = validationResponse => {
    console.log('jhgjkhgjghgkjghkjhjhkj', validationResponse)
    this.setState({
      [validationResponse[0]]: validationResponse[1]
    }, this.formValid );
  }

  validatePassword = fieldValue => {
    this.setState({ passwordValue: fieldValue }, () => {
      this.handleFieldValue(new Validation().password(fieldValue));
    });
  }

  validateEmail = fieldValue => {
    this.setState({ emailValue: fieldValue }, () => {
      this.handleFieldValue(new Validation().email(fieldValue));
    });
  }

  render () {
    return (
      <form className="registration" onSubmit={e => this.handleSubmit(e)}>
        <h2>sign in</h2>
        <div className="registration__hint">* required field</div>
        <div className="form-group">
          <label htmlFor="email">email</label>
          <input className="registration__control" type="text" name="email" id="email"
            onChange={e => this.validateEmail(e.target.value)}
          />
          <p>{this.state.emailError}</p>
        </div>
        <div className="form-group">
           <label htmlFor="password">Password *</label>
           <input type="password" className="registration__control" name="password" id="password"
              onChange={e => this.validatePassword(e.target.value)}
            />
           <p>{this.state.passwordError}</p>
        </div>
        <div className="registration__button__group">
         <button type="submit" className="registration__button" disabled={!this.state.formValid}>
           Save
         </button>
        </div>
      </form>
   )
 }
}

export default SignInWithEmailForm;
