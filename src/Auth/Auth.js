import React, { useContext, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import {RegistrationForm} from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import Modal from '../Modal/Modal.js';
import SessionContext from '../SessionContext.js';
import useOAuth from './useOAuth.js';
import { withRouter, Redirect } from 'react-router-dom';
import './Auth.css';
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md#important-note
const Auth = props => {

  const sessionContext = useContext(SessionContext);
	const [oAuthRequest, setOAuthRequest, state] = useOAuth();

	console.log(state);
	if (state.isNew && !state.error) {
		return (
			<Redirect to="/auth/verification"/>
		);
	} else {
		// TODO some other condiitonal routing to flesh out forms
	}

	return (
		<Fragment>
      <Route path='/auth/registration' component={RegistrationForm} />
      <Route path='/auth/signin' component={SignInWithEmailForm} />
      <Route exact path='/auth/verification' component={VerificationForm} />
		</Fragment>
  );
};

export default withRouter(Auth);
