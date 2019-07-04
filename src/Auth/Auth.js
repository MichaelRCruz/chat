import React, { useEffect, useState, Fragment } from 'react';
import { Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
import VerificationForm from './VerificationForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
// merge these stylesheets
import './Auth.css';
import './SignInWithEmailForm.css';

const Auth = props => {
  const {
    oAuthResponse,
    setOAuthResponse,
    methods,
    setMethods,
    setSelection,
    isOAuthCanceled: dead,
    setIsOAuthCanceled,
    oAuthError
  } = useOAuth();
  const { isAuthLinkSent, setIsAuthLinkSent, setAuthEmail } = useAuthLink();

  useEffect(() => {
    if (!dead) {
      if (oAuthResponse) {
        console.log(oAuthResponse);
        props.history.push('/chat/rooms/?rm=lastVisited');
      }
      if (oAuthResponse.isNew || isAuthLinkSent || methods) {
        props.history.push('verification');
      }
    }
    return () => {
      setIsOAuthCanceled(true);
    }
  }, [oAuthResponse, isAuthLinkSent]);

	return (
		<Fragment>
			<Route path='/auth/registration' render={muhProps => {
        // console.log(window.history);
        return (
          <RegistrationForm
            handleClose={() => { props.history.push('/') }}
            setSelection={setSelection}
            setAuthEmail={setAuthEmail}
          />
        );
      }} />
			<Route path='/auth/verification' render={() => {
        return (
          <VerificationForm
            handleClose={() => { props.history.push('/') }}
          />
        );
      }} />
		</Fragment>
	);
};

export default Auth;
