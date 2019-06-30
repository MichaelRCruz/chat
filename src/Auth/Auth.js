import React, { useEffect, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import useAuthLink from '../hooks/useAuthLink.js';
import useRedirect from '../hooks/useRedirect.js';
// import SessionContext from '../SessionContext.js';
import './Auth.css';

const Auth = props => {
	// const context = useContext(SessionContext);
	const response = useRedirect();
	const {
		redirectLoading,
    isNew,
    methods,
    redirectError,
    methodError,
    uid
  } = response;

	const { email, linkError, wasSubmitted } = useAuthLink(null);

	const isError = redirectError || methodError;

	const redirectAfterAuth = () => {
		if (isError) {
			console.log(redirectError, methodError, linkError);
		} else if (isNew && !isError) {
			console.log('is new user', response);
		} else if (uid && !isError) {
			const jsonStorage = JSON.stringify(response, null, 2);
			localStorage.setItem('potatoAuth', jsonStorage);
			// props.history.push(`/chat`);
		} else if (wasSubmitted) {
			console.log('is email', email);
		} else if (methods) {
			console.log('muh methods', methods);
		} else {
			console.log('that is all you have?h');
		}
	}

	useEffect(() => {
		if (!redirectLoading && uid && !wasSubmitted) redirectAfterAuth();
		if (wasSubmitted) redirectAfterAuth();
		return () => {
			console.log('clean up invoked');
		}
  }, [uid, redirectLoading, wasSubmitted]);

	return (
		<Fragment>
			<Route path='/auth/registration' component={RegistrationForm} />
			<Route path='/auth/signin' component={SignInWithEmailForm} />
			<Route path='/auth/verification' component={VerificationForm} />
		</Fragment>
	);
};

export default withRouter(Auth);

// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md#important-note
