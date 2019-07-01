import React, { useEffect, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import './Auth.css';

const Auth = props => {
	// const response = useRedirect();
	// const {
	// 	redirectLoading,
  //   isNew,
  //   methods,
  //   redirectError,
  //   methodError,
  //   uid
  // } = response;
	// const { email, linkError, linkRequested, setLinkRequested } = useAuthLink(null);
	// const isError = redirectError || methodError;

	// const redirectAfterAuth = () => {
	// 	if (isError) {
	// 		console.log(redirectError, methodError, linkError);
	// 	} else if (isNew && !isError) {
	// 		console.log('is new user', response);
	// 	} else if (uid && !isError) {
	// 		const jsonStorage = JSON.stringify(response, null, 2);
	// 		localStorage.setItem('potatoAuth', jsonStorage);
	// 		// props.history.push(`/chat`);
	// 	} else if (wasSubmitted) {
	// 		console.log('is email', linkRequested);
	// 	} else if (methods) {
	// 		console.log('muh methods', methods);
	// 	} else {
	// 		console.log('that is all you have?h');
	// 	}
	// }
	// useEffect(() => {
	// 	// isAuth = uid && !isNew && !methods && redirectLoading;
	// 	return () => {
	// 		setLinkRequested(false);
	// 	}
  // }, [uid, linkRequested]);
	//
	// if (redirectLoading) {
	// 	return <div className="loadingAnimation"></div>;
	// } else if (isAuth) {
	// 	// isAuth = false;
	// 	props.history.push(`/chat/rooms/lastVisited`);
	// }

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
