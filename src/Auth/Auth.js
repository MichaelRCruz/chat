import React, { useContext } from 'react';
import RegistrationForm from './RegistrationForm.js';
import SignInWithEmailForm from './SignInWithEmailForm.js';
import VerificationForm from './VerificationForm.js';
import Modal from '../Modal/Modal.js';
import SessionContext from '../SessionContext.js';
import './Auth.css';

const Auth = props => {
  const muhContext = useContext(SessionContext);
  return (
    <Modal
      title="settings"
      show={true}
      children={RegistrationForm}
      handleClose={null}>
    </Modal>
  );
};

export default Auth;
