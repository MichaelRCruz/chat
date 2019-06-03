import React from 'react';
import Validation from '../validation.js';
import { debounce } from '../utils.js';

import './RegistrationForm.css';

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displaynameValue: '',
      emailValue: '',
      passwordValue: '',
      retypePasswordValue: '',
      displaynameError: '',
      emailError: '',
      passwordError: '',
      retypePasswordError: ''
    }
    this.debounceDisplayname = debounce(async fieldValue => {
      try {
        this.handleFieldValue(await new Validation().displayname(fieldValue));
      } catch (error) {
        console.log(error);
      }
    }, 250);
  };

  formValidated = () => {
    const {
      displaynameValue,
      emailValue,
      passwordValue,
      retypePasswordValue,
      displaynameError,
      emailError,
      passwordError,
      retypePasswordError
    } = this.state;
    const hasErrors = displaynameError.length || emailError.length
                    || passwordError.length || retypePasswordError.length
                    ? true : false;
    const hasValues = displaynameValue.length && emailValue.length
                    && passwordValue.length && retypePasswordValue.length
                    ? true : false;
    this.setState({ formValidated: !hasErrors && hasValues });
  };

  handleFieldValue = validationResponse => {
    this.setState({
      [validationResponse[0]]: validationResponse[1]
    }, this.formValidated );
  };

  validateDisplayname = fieldValue => {
    this.setState({ displaynameValue: fieldValue }, () => {
      this.debounceDisplayname(fieldValue);
    });
  };

  validateEmail = fieldValue => {
    this.setState({ emailValue: fieldValue }, () => {
      this.handleFieldValue(new Validation().email(fieldValue));
    });
  };

  validatePassword = fieldValue => {
    this.setState({ passwordValue: fieldValue }, () => {
      this.handleFieldValue(new Validation().password(fieldValue));
    });
  };

  validateRetypePassword = fieldValue => {
    this.setState({ retypePasswordValue: fieldValue }, () => {
      this.handleFieldValue(new Validation()
      .retypePassword(this.state.passwordValue, this.state.retypePasswordValue));
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { displaynameValue, emailValue, passwordValue } = this.state;
    this.props.registerUser(displaynameValue, emailValue, passwordValue);
  };

  signInWithGoogle = () => {
    this.props.signInWithGoogle();
  }

  toggleRegistrationMode = () => {
    this.props.toggleRegistrationMode(false);
  }

  render () {
    const { displaynameError, emailError, passwordError, retypePasswordError } = this.state;
    return (
      <form className="registrationFormComponent" onSubmit={e => this.handleSubmit(e)}>
        <fieldset className="registrationFieldset">
          <legend className="registrationLegend"><p className="appNameAtAuth">Potato</p></legend>
          <div className="parentFlex">
            <div className="formGroup registrationFormGroup">
              <input
                className="input displaynameInput"
                type="text"
                name="email"
                placeholder="e.g., mykey_42"
                onChange={e => this.validateDisplayname(e.target.value)}
              />
              <p className="errorMessage">{displaynameError}</p>
            </div>
            <div className="formGroup emailFormGroup">
              <input
                className="input emailInput"
                type="email"
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
            <div className="formGroup retypePasswordFormGroup">
              <input
                className="input passwordInput"
                type="password"
                name="retypePassword"
                placeholder="password"
                onChange={e => this.validateRetypePassword(e.target.value)}
              />
              <p className="errorMessage">{retypePasswordError}</p>
            </div>
            <button
              className="registrationButton"
              type="submit"
              disabled={!this.state.formValidated}>
              create account
            </button>
            <span className="horizontalRule"> or </span>
            <img
              className="googleButton"
              onClick={this.signInWithGoogle}
              src={require('../assets/btn_google_signin_dark_normal_web@2x.png')}
              alt=""
            />
            <p className="toggleFormLink">
              have an account? <span onClick={this.toggleRegistrationMode}>sign in!</span>
            </p>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default RegistrationForm;
