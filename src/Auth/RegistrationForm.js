import React, { Fragment, useEffect } from 'react';
import useForm from './useForm.js';
import Modal from '../Modal/Modal.js';
import './RegistrationForm.css';

const RegistrationForm = props => {

  const { setSelection, setAuthEmail, handleClose } = props;
  const formCallback = (payload, clearForm) => {
    setAuthEmail(payload.email);
    clearForm();
  };
  const {
    handleSubmit,
    handleChange,
    authFormErrors,
    authFormValues
  } = useForm(formCallback);

  return (
    <Modal show={true} handleClose={handleClose}>
      <form className="signInFormComponent" onSubmit={handleSubmit}>
        <fieldset className="signInFieldset">
          <legend className="signInWithEmailLegend">
            <p className="appNameAtAuth">Potato</p>
          </legend>
          <div className="parentFlex">
            <div className="formGroup passwordFormGroup">
              <p className="errorMessage">{authFormErrors.emailError || ''}</p>
              <input
                className="input emailInput"
                type="email"
                name="email"
                placeholder="email"
                value={authFormValues.email || ''}
                onChange={handleChange}
              />
            </div>
            <button
              className="signInWithEmailButton"
              type="submit"
              disabled={false}>
              send dynamic link
            </button>
            <span className="horizontalRule"> or </span>
            <img
              className="googleButton"
              src={require('../assets/btn_google_signin_dark_normal_web@2x.png')}
              alt=""
              onClick={() => setSelection('GOOGLE_SIGN_IN_METHOD')}
            />
            <p className="toggleFormLink">
              We prefer Google. <span>Here's why.</span>
            </p>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
};

export default RegistrationForm;
