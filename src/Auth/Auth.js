import React, { useContext, useEffect, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import Modal from '../Modal/Modal.js';
import useRedirect from '../hooks/useRedirect.js';
import useAuthLink from '../hooks/useAuthLink.js';
import { withRouter, Redirect } from 'react-router-dom';
import SessionContext from '../SessionContext.js';
import './Auth.css';

const Auth = props => {
	const { updateUser } = useContext
	const {redirectLoading, ...rest} = useRedirect();
	useEffect(() => {
		if (!redirectLoading) {
			console.log(rest.userInfo);
		}
  }, [redirectLoading]);
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
