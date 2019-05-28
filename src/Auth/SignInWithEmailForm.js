import React, { Component } from 'react';
import ValidationError from '../ValidationError.js';
import './SignInWithEmailForm.css';

class SignInWithEmailForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailValid: false,
      passwordValid: false,
      formValid: false,
      validationMessages: {
        email: '',
        password: ''
      }
    }
  }

  updateEmail(email) {
    this.setState({email}, () => {this.validateName(email)});
  }

  updatePassword(password) {
    this.setState({password}, () => {this.validatePassword(password)});
  }

  handleSubmit(event) {
    event.preventDefault();
    const {email, password} = this.state;
    this.props.signInWithEmail(email, password);
  }

  validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;
    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.name = 'Name is required';
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.name = 'Name must be at least 3 characters long';
        hasError = true;
      } else {
        fieldErrors.name = '';
        hasError = false;
      }
    }
    this.setState({
      validationMessages: fieldErrors,
      emailValid: !hasError
    }, this.formValid );
  }

  validatePassword(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.password = 'Password is required';
      hasError = true;
    } else {
      if (fieldValue.length < 6 || fieldValue.length > 13) {
        fieldErrors.password = 'Password must be between 6 and 13 characters long';
        hasError = true;
      } else {
        if(!fieldValue.match(new RegExp(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/))) {
          fieldErrors.password = 'Password must contain at least one number and one letter';
          hasError = true;
        } else {
          fieldErrors.password = '';
          hasError = false;
        }
      }
    }

    this.setState({
      validationMessages: fieldErrors,
      passwordValid: !hasError
    }, this.formValid );

  }

  formValid() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid
    });
  }

  render () {
    return (
     <form className="registration" onSubmit={e => this.handleSubmit(e)}>
       <h2>Sign In</h2>
       <div className="registration__hint">* required field</div>
       <div className="form-group">
         <label htmlFor="email">Email *</label>
         <input type="text" className="registration__control"
           name="email" id="email" onChange={e => this.updateEmail(e.target.value)}/>
       </div>
       <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input type="password" className="registration__control"
           name="password" id="password" onChange={e => this.updatePassword(e.target.value)} />
          <div className="registration__hint">warning placeholder</div>
       </div>
       <div className="registration__button__group">
        <button type="reset" className="registration__button">
            Cancel
        </button>
        <button type="submit" className="registration__button" disabled={!this.state.formValid}>
            Save
        </button>
       </div>
     </form>
   )
 }
}

export default SignInWithEmailForm;
