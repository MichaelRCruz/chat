import React from 'react';
import Validation from '../validation.js';
import './SignInWithEmailForm.css';

class SignInWithEmailForm extends React.Component {
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
    const { emailValue, passwordValue, emailError, passwordError } = this.state;
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

  toggleRegistrationMode = () => {
    this.props.toggleRegistrationMode(true);
  }

  render () {
    const { emailError, passwordError } = this.state;
    return (
      <form className="signInFormComponent" onSubmit={e => this.handleSubmit(e)}>
        <fieldset className="signInFieldset">
          <legend className="signInWithEmailLegend"><p className="appName">Potato</p></legend>
          <div className="parentFlex">
            <div className="formGroup emailFormGroup">
              <input
                className="input emailInput"
                type="text"
                name="email"
                placeholder="email"
                onChange={e => this.validateEmail(e.target.value)}
              />
              <p className="errorMessage">{emailError}</p>
            </div>
            <div className="formGroup passwordFormGroup">
              <input
                className="input passwordInput"
                type="password"
                name="password"
                placeholder="password"
                onChange={e => this.validatePassword(e.target.value)}
              />
              <p className="errorMessage">{passwordError}</p>
            </div>
            <button
              className="signInWithEmailButton"
              type="submit"
              disabled={!this.state.formValidated}>
              sign in with email
            </button>
            <span className="horizontalRule"> or </span>
            <img
              className="googleButton"
              onClick={this.signInWithGoogle}
              src={require('../assets/btn_google_signin_dark_normal_web@2x.png')}
              alt=""
            />
            <p className="toggleFormLink">
              don't have an account? <span onClick={this.toggleRegistrationMode}>sign up!</span>
            </p>
          </div>
        </fieldset>
      </form>
    )
  };
};

export default SignInWithEmailForm;
