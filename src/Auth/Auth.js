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
    setOAuthError
  } = useOAuth();
  const { authEmail, isAuthLinkSent, setIsAuthLinkSent, setAuthEmail } = useAuthLink();

  // const otherAuthMethods = async email => {
  //   const authMethods = await getEmailMethods(email);
  //   return authMethods;
  // }

  const getEmailMethods = async email => {
    firebase.auth().fetchSignInMethodsForEmail(email)
      .then(methods => {
        if (methods[0] === 'password') {
          // setOAuthStatus({ loading: true, status: 'RECOVERING' });
          setMethods(methods);
        }
      })
      .catch(error => {
        // setOAuthStatus({ loading: false, status: 'FAULT' });
        setOAuthError(error);
      });
  };

  useEffect(() => {
    if (!dead) {
      if (oAuthResponse) {
        const { code, ...rest } = oAuthResponse;
        if (code === 'auth/account-exists-with-different-credential') {
          firebase.auth().fetchSignInMethodsForEmail(rest.email)
            .then(methods => {
              console.log(methods);
            })
            .catch(error => {
              // setOAuthStatus({ loading: false, status: 'FAULT' });
              console.log(error);
            });
        } else {
          console.log(code, rest);
        }
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
