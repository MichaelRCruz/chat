import React, { useEffect, Fragment } from 'react';
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
    oAuthStatus,
    oAuthError
  } = useOAuth();
  const { isAuthLinkSent, setIsAuthLinkSent, setAuthEmail } = useAuthLink();

  useEffect(() => {
    if (!dead && oAuthResponse) {
      // console.log('oAuthResponse', oAuthResponse);
      // console.log('methods', methods);
      // console.log('get busy');
      // console.log(oAuthStatus);
      props.history.push('/chat/rooms/?rm=lastVisited');
    }
    if (!dead && isAuthLinkSent) {
      props.history.push('verification');
    }
    return () => {
      // console.log('oAuthResponse', oAuthResponse);
      // console.log('methods', methods);
      setIsOAuthCanceled(true);
    }
  }, [oAuthResponse, isAuthLinkSent, methods]);

	return (
		<Fragment>
			<Route path='/auth/registration' render={() => {
        console.log(oAuthStatus);
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
