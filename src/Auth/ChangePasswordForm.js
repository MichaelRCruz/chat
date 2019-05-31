import React from 'react';
import Validation from '../validation.js';
// import './RegistrationForm.css';

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordValue: '',
      retypePasswordValue: '',
      passwordError: '',
      retypePasswordError: ''
    }
  };

  formValidated = () => {
    const {
      passwordValue,
      retypePasswordValue,
      passwordError,
      retypePasswordError
    } = this.state;
    const hasErrors = passwordError.length || retypePasswordError.length
                    ? true : false;
    const hasValues = passwordValue.length || retypePasswordValue.length;
    this.setState({ formValidated: !hasErrors && hasValues });
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

  validateRetypePassword = fieldValue => {
    this.setState({ retypePasswordValue: fieldValue }, () => {
      this.handleFieldValue(new Validation()
      .retypePassword(this.state.passwordValue, this.state.retypePasswordValue));
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { passwordValue } = this.state;
    this.props.updatePassword(passwordValue);
  };

  render () {
    const { passwordError, retypePasswordError } = this.state;
    return (
      <form className="changePasswordFormComponent" onSubmit={e => this.handleSubmit(e)}>
        <fieldset className="changePasswordFieldset">
          <legend className="changePasswordLegend">
            <p className="changePasswordLegendContent">change password</p>
          </legend>
          <div className="changePasswordParentFlex">
            <div className="formGroup changePasswordFormGroup">
              <input
                className="changePasswordInput"
                type="password"
                name="password"
                placeholder="password"
                onChange={e => this.validatePassword(e.target.value)}
              />
              <p className="errorMessage">{passwordError}</p>
            </div>
            <div className="formGroup changePasswordRetypeFormGroup">
              <input
                className="changePasswordInput"
                type="password"
                name="retypePassword"
                placeholder="password"
                onChange={e => this.validateRetypePassword(e.target.value)}
              />
              <p className="errorMessage">{retypePasswordError}</p>
            </div>
            <button
              className="changePasswordButton"
              type="submit"
              disabled={!this.state.formValidated}>
              change password
            </button>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default ChangePasswordForm;
