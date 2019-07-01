import React, { Fragment, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import useForm from './useForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
import useRedirect from '../hooks/useRedirect.js';
import './RegistrationForm.css';

const RegistrationForm = props => {

  const { emailMethods, oAuthError, setSelection, oAuthResponse, setIsOAuthCanceled } = useOAuth();
	const { email, sendLink, linkError, setLinkCanceled } = useAuthLink(null);
  const submitLink = muhStuff => {
    sendLink(muhStuff.email);
  }
  const { values, errors, handleChange, handleSubmit } = useForm(submitLink);
  const hasError = linkError || oAuthError;
  const isFlushed = setIsOAuthCanceled && setLinkCanceled && !hasError;

  useEffect(() => {
    if (oAuthResponse && isFlushed) {
      props.history.push('/chat/rooms/?rm=lastVisited');
    } else if ((emailMethods || email) && isFlushed) {
      props.history.push('/auth/verification');
    } else if (emailMethods && isFlushed) {
      props.history.push('/chat/rooms');
    }
  }, [errors, oAuthResponse, setIsOAuthCanceled, setLinkCanceled]);

  return (
    <Fragment>
      <form className="signInFormComponent">
        <fieldset className="signInFieldset">
          <legend className="signInWithEmailLegend">
            <p className="appNameAtAuth">Potato</p>
          </legend>
          <div className="parentFlex">
            <div className="formGroup passwordFormGroup">
              <input
                className="input emailInput"
                type="email"
                name="email"
                placeholder="email"
                value={values.email || ''}
                onChange={handleChange}
              />
            <p className="errorMessage">{errors.email}</p>
            </div>
            <button
              className="signInWithEmailButton"
              type="submit"
              disabled={false}
              onClick={handleSubmit}>
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
