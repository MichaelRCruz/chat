import React from 'react';
import * as firebase from 'firebase';
import Validation from '../validation.js';
import { debounce } from '../utils.js';

import './VerificationForm.css';

class VerificationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayNameValue: '',
      emailValue: '',
      passwordValue: '',
      displayNameError: '',
      emailError: '',
      passwordError: ''
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
      displayNameError,
      emailError,
      passwordError
    } = this.state;
    const hasErrors = displayNameError.length || emailError.length
                    || passwordError.length
                    ? true : false;
    const hasValues = displaynameValue.length && emailValue.length
                    && passwordValue.length
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

  handleSubmit = event => {
    event.preventDefault();
    const { displayNameValue, emailValue, passwordValue } = this.state;
    this.props.verifyCredentials(displayNameValue, emailValue, passwordValue);
  };

  toggleRegistrationMode = () => {
    this.props.toggleRegistrationMode(false);
  }

  componentDidMount() {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem('potatoEmailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      firebase.auth().signInWithEmailLink(email, window.location.href)
        .then(result => {
          window.localStorage.removeItem('emailForSignIn');
          console.log(result);
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch(function(error) {
          throw new Error(error);
        });
    }
  }

  render () {
    const { displayNameError, emailError, passwordError } = this.state;
    return (
      <form className="verificationFormComponent" onSubmit={e => this.handleSubmit(e)}>
        <fieldset className="verificationFieldset">
          <legend className="verificationLegend"><p className="appNameAtAuth">Potato</p></legend>
          <div className="parentFlex">
            <div className="formGroup verificationFormGroup">
              <p className="errorMessage">{displayNameError}</p>
              <input
                className="input displaynameInput"
                type="text"
                name="email"
                placeholder="e.g., mykey_42"
                onChange={e => this.validateDisplayname(e.target.value)}
              />
            </div>
            <div className="formGroup emailFormGroup">
              <p className="errorMessage">{emailError}</p>
              <input
                className="input emailInput"
                type="email"
                name="email"
                placeholder="email"
                onChange={e => this.validateEmail(e.target.value)}
              />
            </div>
            <div className="formGroup passwordFormGroup">
              <p className="errorMessage">{passwordError}</p>
              <input
                className="input passwordInput"
                type="password"
                name="password"
                placeholder="password"
                onChange={e => this.validatePassword(e.target.value)}
              />
            </div>
            <button
              className="verificationButton"
              type="submit"
              disabled={!this.state.formValidated}>
              create account
            </button>
            <p className="toggleFormLink">
              have an account? <span onClick={this.toggleRegistrationMode}>sign in!</span>
            </p>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default VerificationForm;
