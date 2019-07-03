import React, { useEffect, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import useOAuth from './useOAuth.js';
import useAuthLink from '../hooks/useAuthLink.js';
import useForm from '../Auth/useForm.js';
import './Auth.css';

const Auth = props => {
  const { oAuthResponse, setOAuthResponse, setSelection } = useOAuth();
  const { isAuthLinkSent, setIsAuthLinkSent, setAuthEmail } = useAuthLink();
  const { authRouterProps } = props;
  // const { wasFormSubmitted, setWasFormSubmitted } = useForm();
  // console.log(props);

  // const { setSelection } = useOAuth();
  // const { setAuthEmail } = useAuthLink();
  // const formCallback = (payload) => (setAuthEmail(payload));
  // const { handleSubmit, handleChange, authFormErrors, authFormValues } = useForm(formCallback);

  useEffect(() => {
    if (oAuthResponse) {
      props.history.push('/chat/rooms/?rm=lastVisited');
    }
    return () => {
      setIsAuthLinkSent(false);
      setOAuthResponse(false);
    }
  }, [oAuthResponse, isAuthLinkSent]);

	return (
		<Fragment>
			<Route path='/auth/registration' render={regsProps => {
        return <RegistrationForm
          setSelection={setSelection}
          setAuthEmail={setAuthEmail}
        />
      }} />
			<Route path='/auth/signin' component={SignInWithEmailForm} />
			<Route path='/auth/verification' component={VerificationForm} />
		</Fragment>
	);

};

export default Auth;

// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md#important-note
