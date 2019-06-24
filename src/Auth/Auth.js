import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import RegistrationForm from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import Modal from '../Modal/Modal.js';
import SessionContext from '../SessionContext.js';
import OAuth from './OAuth.js';
import './Auth.css';

const Auth = props => {
  const sessionContext = useContext(SessionContext);
  return (
    <Modal show={true} handleClose={null}>
      <Route path='/auth/registration' component={RegistrationForm} />
      <Route path='/auth/signin' component={SignInWithEmailForm} />
      <Route path='/auth/verification' component={VerificationForm} />
      <Route component={RegistrationForm} />
    </Modal>
  );
};

export default Auth;
