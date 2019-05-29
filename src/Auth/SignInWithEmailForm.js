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
      formValidated: false
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { emailValue, passwordValue } = this.state;
    this.props.signInWithEmail(emailValue, passwordValue);
  };

  formValidated = () => {
    const {emailValue, passwordValue, emailError, passwordError} = this.state;
    const hasErrors = emailError.length || passwordError.length ? true : false;
    const hasValues = emailValue.length && passwordValue.length;
    this.setState({
      formValidated: !hasErrors && hasValues
    });
  };

  handleFieldValue = validationResponse => {
    this.setState({
      [validationResponse[0]]: validationResponse[1]
    }, this.formValidated );
  };

  validatePassword = fieldValue => {
    this.setState({ passwordValue: fieldValue }, () => {
      this.handleFieldValue(new Validation().password(fieldValue));
    });
  };

  validateEmail = fieldValue => {
    this.setState({ emailValue: fieldValue }, () => {
      this.handleFieldValue(new Validation().email(fieldValue));
    });
  };

  render () {
    const { emailError, passwordError } = this.state;
    return (
      <form className="signInWithEmailComponent" onSubmit={e => this.handleSubmit(e)}>
        <div className="emailFormGroup">
          <input className="emailInput" type="text" name="email"
            onChange={e => this.validateEmail(e.target.value)}
          />
          <p>{this.state.emailError}</p>
        </div>
        <div className="passwordFormGroup">
          <input className="passwordInput" type="password" name="password"
            onChange={e => this.validatePassword(e.target.value)}
          />
          <p>{this.state.passwordError}</p>
        </div>
        <div className="signInButtonGroup">
          <button type="submit" className="signInWithEmailButton" disabled={!this.state.formValidated}>
            Save
          </button>
        </div>
      </form>
   );
 };

};

export default SignInWithEmailForm;
