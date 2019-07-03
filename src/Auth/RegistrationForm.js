import React, { Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import useForm from './useForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
import useRedirect from '../hooks/useRedirect.js';
import './RegistrationForm.css';

const RegistrationForm = props => {

  // const { setSelection, oAuthResponse, setOAuthResponse } = useOAuth();
  // const { isNewUser, emailMethods, setIsNewUser, setEmailMethods } = useOAuth();
  // const { sendAuthLink, setIsAuthLinkSent, isAuthLinkSent } = useAuthLink();
  // const formCallback = (payload) => (sendAuthLink(payload));
  // const { handleSubmit, handleChange, authFormErrors, authFormValues } = useForm(formCallback);

  // useEffect(() => {
  //   if (isAuthLinkSent || isNewUser || emailMethods) {
  //     console.log(isAuthLinkSent, isNewUser, emailMethods);
  //     props.history.push('/auth/verification');
  //     // return null;
  //   } else if (oAuthResponse) {
  //     console.log('oAuthResponse', oAuthResponse);
  //     props.history.push('/chat/rooms/?rm=lastVisited');
  //     // return null;
  //   }
  //   return () => {
  //     setIsAuthLinkSent(false);
  //     setSelection(false);
  //     setIsNewUser(false);
  //     setEmailMethods(false);
  //     setOAuthResponse(false);
  //   }
  // }, [oAuthResponse, isAuthLinkSent]);

  // if (isAuthLinkSent || isNewUser || emailMethods) {
  //   console.log(isAuthLinkSent, isNewUser, emailMethods);
  //   return <Redirect to="/auth/verification" push={false} />
  //   // props.history.push('/auth/verification');
  //   // return null;
  // } else if (oAuthResponse) {
  //   console.log('oAuthResponse', oAuthResponse);
  //   return <Redirect to="/chat/rooms/?rm=lastVisited" push={false} />
  //   // props.history.push('/chat/rooms/?rm=lastVisited');
  //   // return null;
  // }

  // const { setSelection } = useOAuth();
  // const { setAuthEmail } = useAuthLink();
  const { setSelection, setAuthEmail } = props;
  const formCallback = (payload) => (setAuthEmail(payload));
  const { handleSubmit, handleChange, authFormErrors, authFormValues } = useForm(formCallback);

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

export default RegistrationForm;
