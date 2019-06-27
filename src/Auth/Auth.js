import React, { useContext, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import {RegistrationForm} from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import Modal from '../Modal/Modal.js';
import useOAuth from './useOAuth.js';
import { withRouter, Redirect } from 'react-router-dom';
import './Auth.css';

const Auth = props => {
	const [oAuthRequest, setOAuthRequest, state] = useOAuth();
	const { isDuplicate, isNew, error } = state;
  console.log(state);
	if (isNew && !error) {
		return <Redirect to="/auth/verification"/>;
	} else if (isDuplicate && !error) {
		return <Redirect to="/auth/signin"/>;
	} else {
		return (
			<Fragment>
	      <Route path='/auth/registration' component={RegistrationForm} />
	      <Route path='/auth/signin' component={SignInWithEmailForm} />
	      <Route path='/auth/verification' component={VerificationForm} />
			</Fragment>
		);
	}
};

export default withRouter(Auth);

// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md#important-note
