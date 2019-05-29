import React, { Component } from 'react';
import Validation from '../validation.js';
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

  handleSubmit = event => {
    event.preventDefault();
    const { displayname, email, password, retypePassword } = this.state;
    this.props.registerUser(displayname, email, password)
    .then(() => {
      this.props.toggleRegistrationMode(false);
    });
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
          <button className="registrationButton" onClick={this.signInWithGoogle}>
            sign in
          </button>
        </form>
        <button className="googleButton">Sign in with Google</button>
      </div>
    )
  }
}

export default RegistrationForm;

// <button className="googleButton">
//   <p>Sign in with Google</p>
// </button>
// <button onClick={() => this.toggleRegistrationMode(false)}>
//   <p>render form</p>
// </button>
