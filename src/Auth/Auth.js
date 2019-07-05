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
        console.log(oAuthResponse);
        props.history.push('/chat/rooms/?rm=lastVisited');
      }
      if (oAuthResponse.isNew || isAuthLinkSent || methods) {
        props.history.push('verification');
      }
    }
    return () => {
      setIsAuthLinkSent(false);
      setIsOAuthCanceled(true);
    }
  }, [oAuthResponse, isAuthLinkSent]);

  // const sendAuthLink = async email => {
  //   return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
  //     .then(() => {
  //       // localStorage.setItem('potatoEmail', email);
  //       setIsAuthLinkSent(true);
  //     })
  //     .catch(error => {
  //       setAuthLinkError(error);
  //     });
  // };

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
