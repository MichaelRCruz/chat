import React, { useContext, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import {RegistrationForm} from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import Modal from '../Modal/Modal.js';
import SessionContext from '../SessionContext.js';
import './Auth.css';

const Auth = props => {
  const sessionContext = useContext(SessionContext);
  return (
		<Fragment>
      <Route path='/auth/registration' component={RegistrationForm} />
      <Route path='/auth/signin' component={SignInWithEmailForm} />
      <Route path='/auth/verification' component={VerificationForm} />
		</Fragment>
  );
};

export default Auth;
