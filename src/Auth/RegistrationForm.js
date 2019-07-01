import React, { Fragment, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import useForm from './useForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
import useRedirect from '../hooks/useRedirect.js';
import './RegistrationForm.css';

const RegistrationForm = props => {

  const { setSelection, ...oAuth } = useOAuth();
  const { setAuthEmail, isAuthLinkSent, ...authLink } = useAuthLink();
  const { handleSubmit, handleChange, authFormErrors, authFormValues, ...authFormRest } = useForm();



  useEffect(() => {
    // console.log('authForm:', authFormRest);
    console.log('authLink:', authFormRest);
    // console.log('authLink:', authLink);
  }, [authFormRest]);

  return (
    <Fragment>
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
              don't have an account? <span>sign up!</span>
            </p>
          </div>
        </fieldset>
      </form>
    </Fragment>
  );
};

export default withRouter(RegistrationForm);
