import React, { Component } from 'react';
import Validation from '../validation.js';
// import googleAuthButton from './assets/btn_google_signin_light_normal_web@2x.png';
import './RegistrationForm.css';

class RegistrationForm extends Component {
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
    const hasErrors = displaynameError.length || emailError.length || passwordError.length || retypePasswordError.length ? true : false;
    const hasValues = displaynameValue.length || emailValue.length || passwordValue.length || retypePasswordValue.length;
    this.setState({ formValidated: !hasErrors && hasValues });
  };

  handleFieldValue = validationResponse => {
    this.setState({
      [validationResponse[0]]: validationResponse[1]
    }, this.formValidated );
  };

  validateDisplayname = fieldValue => {
    this.setState({ displaynameValue: fieldValue }, () => {
      this.handleFieldValue(new Validation().displayname(fieldValue));
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
      this.handleFieldValue(new Validation().retypePassword(this.state.passwordValue, this.state.retypePasswordValue));
    });
  };

  registerUser = () => {
    const {displayName, emailValue, passwordValue} = this.state;
    this.props.registerUser(displayName, emailValue, passwordValue);
  }

  signInWithGoogle = () => {
    this.props.signInWithGoogle();
  }

  render () {
    return (
      <div className="registrationFormComponent">
        <form className="registrationForm" onSubmit={e => this.handleSubmit(e)}>
          <div className="nameFormGroup">
            <input
             className="nameInput" type="text"
             onChange={e => this.validateDisplayname(e.target.value)}
           />
             <p className="formErrorText">{this.state.displaynameError}</p>
          </div>
          <div className="emailFormGroup">
            <input
             className="emailInput" type="text"
             onChange={e => this.validateEmail(e.target.value)}
           />
             <p className="formErrorText">{this.state.emailError}</p>
          </div>
          <div className="passwordFormGroup">
            <input
             className="passwordInput" type="text"
             onChange={e => this.validatePassword(e.target.value)}
           />
             <p className="formErrorText">{this.state.passwordError}</p>
          </div>
          <div className="retypePasswordFormGroup">
            <input
             className="retypePasswordInput" type="text"
             onChange={e => this.validateRetypePassword(e.target.value)}
           />
             <p className="formErrorText">{this.state.retypePasswordError}</p>
          </div>
          <button className="registrationButton" onClick={this.registerUser}>
            sign in
          </button>
        </form>
        <img src={require('../assets/btn_google_signin_light_normal_web@2x.png')}
          className="googleButton"
          onClick={this.signInWithGoogle}
        />
      </div>
    )
  }
}

export default RegistrationForm;
