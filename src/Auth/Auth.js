import React, { useEffect, useState, Fragment } from 'react';
import { Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
import VerificationForm from './VerificationForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
// merge these stylesheets
import './Auth.css';
// import './RegistrationForm.css';
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
  const { authEmail, isAuthLinkSent, setIsAuthLinkSent, setAuthEmail } = useAuthLink();

  useEffect(() => {
    if (!dead) {
      if (oAuthResponse) {
        // const cacheRes = localStorage.getItem('cacheRes');
        // const parsedRes = JSON.parse(cacheRes);
        console.log(oAuthResponse);
        console.log(oAuthError);
        console.log('methods: ', methods);
        // console.log('parsedRes: ', parsedRes);
        // props.history.push('/chat/rooms/?rm=lastVisited');
      }
      if (isAuthLinkSent) {
        console.log(isAuthLinkSent);
        // props.history.push('verification');
      }
    }
    return () => {
      setIsAuthLinkSent(false);
      setIsOAuthCanceled(true);
    }
  }, [oAuthResponse, isAuthLinkSent, methods]);

	return (
		<Fragment>
			<Route path='/auth/registration' render={muhProps => {
        return (
          <VerificationForm
            handleClose={() => { props.history.push('/') }}
            setSelection={setSelection}
            setAuthEmail={setAuthEmail}
          />
        );
      }} />
		</Fragment>
	);
};

export default Auth;
