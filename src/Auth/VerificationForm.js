import React, { Fragment, useEffect, useState } from 'react';
import useForm from './useForm.js';
import Modal from '../Modal/Modal.js';
import './VerificationForm.css';

const VerificationForm = props => {

  // this.debounceDisplayname = debounce(async fieldValue => {
  //   try {
  //     this.handleFieldValue(await new Validation().displayname(fieldValue));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, 250);

  const { setSelection, setAuthEmail, handleClose } = props;
  // const { submitCreds } = useAuthComplete();
  const formCallback = (payload, clearForm) => {
    console.log('verification submitted');
    clearForm();
  };
  const {
    handleSubmit,
    handleChange,
    authFormErrors,
    authFormValues
  } = useForm(formCallback);

  const { displayNameValue, emailValue, passwordValue } = authFormValues;
  const { displayNameError, emailError, passwordError } = authFormErrors;

  return (
    <Modal show={true} handleClose={handleClose}>
      <form className="verificationFormComponent" onSubmit={handleSubmit}>
        <fieldset className="verificationFieldset">
          <legend className="verificationLegend"><p className="appNameAtAuth">Potato</p></legend>
          <div className="parentFlex">
            <div className="formGroup verificationFormGroup">
              <p className="errorMessage">{displayNameError}</p>
              <input
                className="input displaynameInput"
                type="text"
                name="text"
                placeholder="e.g., mykey_42"
                value={displayNameValue || ''}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup emailFormGroup">
              <p className="errorMessage">{emailError}</p>
              <input
                className="input emailInput"
                type="email"
                name="email"
                placeholder="email"
                onChange={handleChange}
              />
            </div>
            <div className="formGroup passwordFormGroup">
              <p className="errorMessage">{passwordError}</p>
              <input
                className="input passwordInput"
                type="password"
                name="password"
                placeholder="password"
                onChange={handleChange}
              />
            </div>
            <button
              className="verificationButton"
              type="submit"
              disabled={false}>
              complete registration
            </button>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}

export default VerificationForm;
