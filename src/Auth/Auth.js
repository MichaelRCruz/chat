import React, { useEffect, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
// import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
import './Auth.css';
import './SignInWithEmailForm.css';

const Auth = props => {
  const { oAuthResponse, setOAuthResponse, setSelection } = useOAuth();
  const { isAuthLinkSent, setIsAuthLinkSent, setAuthEmail } = useAuthLink();

  useEffect(() => {
    if (oAuthResponse) {
      props.history.push('/chat/rooms/?rm=lastVisited');
    }
    if (isAuthLinkSent) {
      props.history.push('verification');
    }
    return () => {
      setIsAuthLinkSent(false);
      setOAuthResponse(false);
    }
  }, [oAuthResponse, isAuthLinkSent]);

	return (
		<Fragment>
			<Route path='/auth/registration' render={() => {
        return (
          <RegistrationForm
            setSelection={setSelection}
            setAuthEmail={setAuthEmail}
          />
        );
      }} />

			<Route path='/auth/verification' component={VerificationForm} />
		</Fragment>
	);
};

export default Auth;
