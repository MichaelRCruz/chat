import React, { Fragment, useEffect, useState } from 'react';
import useForm from './useForm.js';
import useOAuth from './useOAuth.js';
import Modal from '../Modal/Modal.js';
import './SignInWithEmailForm.css';
import './VerificationForm.css';

const VerificationForm = props => {
  console.log('VerificationForm was mounted');

  const { oAuthResponse } = useOAuth();
  const { setSelection, authEmail, handleClose } = props;
  const formCallback = (payload, clearForm) => {
    console.log('verification submitted', payload);
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

  useEffect(() => {
    console.log(displayName, email, password);
    return () => {};
  }, [displayName, email, password]);




  console.log('props', setSelection, authEmail, handleClose);

  const displayNameInput = (
    <div className="formGroußp verificationFormGroup">
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
  );

  const emailInput = (
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
  );

  const passwordInput = (
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
  );

  const verificationButton = (
    <button
      className="verificationButton"
      type="submit"
      disabled={false}>
      complete registration
    </button>
  );

  const emailAuthButton = (
    <button
      className="signInWithEmailButton"
      type="submit"
      disabled={false}>
      send dynamic link
    </button>
  );

  const googleButton = (
    <img
      className="googleButton"
      src={require('../assets/btn_google_signin_dark_normal_web@2x.png')}
      alt=""
      onClick={() => setSelection('GOOGLE_SIGN_IN_METHOD')}
    />
  );

  const disclaimerEtc = (
    <p className="toggleFormLink">
      We prefer Google. <span>Here's why.</span>
    </p>
  );

  const verificationForm = (
    <Modal show={true} handleClose={handleClose}>
      <form className="verificationFormComponent" onSubmit={handleSubmit}>
        <fieldset className="verificationFieldset">
          <legend className="verificationLegend"><p className="appNameAtAuth">Potato</p></legend>
          <div className="parentFlex">
            { displayNameInput }
            { emailInput }
            { passwordInput }
            { verificationButton }
            { googleButton }
          </div>
        </fieldset>
      </form>
    </Modal>
  );

  return verificationForm;
}

export default VerificationForm;
