import React, { useEffect, useState, Fragment } from 'react';
import { Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
import VerificationForm from './VerificationForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
import * as firebase from 'firebase';
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
    oAuthError,
    setOAuthError,
    requestOAuth
  } = useOAuth();
  const { authEmail, isAuthLinkSent, setIsAuthLinkSent, setAuthEmail } = useAuthLink();

  useEffect(() => {
    // if (!dead) {
    //   if (oAuthResponse) {
    //     const { additionalUserInfo, ...rest } = oAuthResponse;
    //     if (!additionalUserInfo.isNewUser) {
    //       props.history.push('/chat/rooms/?rm=lastVisited')
    //     }
    //     // if (code === 'auth/account-exists-with-different-credential') {
    //     //   const pendingCred = rest.credential;
    //     //   console.log(pendingCred);
    //     //   firebase.auth().fetchSignInMethodsForEmail(rest.email)
    //     //     .then(methods => {
    //     //       console.log(methods);
    //     //       // setFormSignature(reAuth);
    //     //       return;
    //     //     })
    //     //     .catch(error => {
    //     //       console.log(error);
    //     //     });
    //     // } else {
    //     //   console.log(code, rest);
    //     // }
    //   }
    // }
    return () => {
      setIsAuthLinkSent(false);
      setIsOAuthCanceled(true);
    }
  }, [oAuthResponse, isAuthLinkSent]);

	return (
		<Fragment>
			<Route path='/auth/registration' render={muhProps => {
        return (
          <VerificationForm
            handleClose={() => { props.history.push('/') }}
            setSelection={setSelection}
            setAuthEmail={setAuthEmail}
            oAuthResponse={oAuthResponse}
            isAuthLinkSent={isAuthLinkSent}
            dead={dead}
            authEmail={authEmail}
          />
        );
      }} />
		</Fragment>
	);
};

export default Auth;
