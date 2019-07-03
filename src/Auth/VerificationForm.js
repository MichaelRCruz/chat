import React, { Fragment, useEffect, useState } from 'react';
import useForm from './useForm.js';
import Modal from '../Modal/Modal.js';
import './VerificationForm.css';

const VerificationForm = props => {

  const { setSelection, setAuthEmail, handleClose } = props;
  // const { submitCreds } = useAuthComplete();
  const formCallback = (payload, clearForm) => {
    console.log(payload, 'verification submitted');
    clearForm();
  };
  const {
    handleSubmit,
    handleChange,
    authFormErrors,
    authFormValues
  } = useForm(formCallback);

  const { displayName, email, password } = authFormValues;
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
                name="displayName"
                placeholder="e.g., mykey_42"
                value={displayName || ''}
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
                value={email || ''}
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
                value={password || ''}
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
