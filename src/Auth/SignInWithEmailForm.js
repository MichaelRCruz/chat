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

  handleSubmit = event => {
    event.preventDefault();
    const { emailValue, passwordValue } = this.state;
    this.props.signInWithEmail(emailValue, passwordValue);
  };

  signInWithGoogle = () => {
    this.props.signInWithGoogle();
  }

  render () {
    const { emailError, passwordError } = this.state;
    return (
      <form className="signInFormComponent" onSubmit={e => this.handleSubmit(e)}>
        <fieldset className="signInFieldset">
          <legend className="signInWithEmailLegend">sign in</legend>
          <div className="parentFlex">
            <div className="emailFormGroup">
              <input
                className="input emailInput"
                type="text"
                name="email"
                onChange={e => this.validateEmail(e.target.value)}
              />
              <p>{emailError}</p>
            </div>
            <div className="passwordFormGroup">
              <input
                className="input passwordInput"
                type="password"
                name="password"
                onChange={e => this.validatePassword(e.target.value)}
              />
              <p>{passwordError}</p>
            </div>
            <div className="signInButtonGroup">
              <button
                className="signInWithEmailButton"
                type="submit"
                disabled={!this.state.formValidated}
              >
                sign in
              </button>
            </div>
            <div className="googleSignInButtonGroup">
              <img
                className="googleButton"
                onClick={this.signInWithGoogle}
                src={require('../assets/btn_google_signin_light_normal_web@2x.png')}
                alt=""
              />
            </div>
          </div>
        </fieldset>
      </form>
    )};

};

export default SignInWithEmailForm;
