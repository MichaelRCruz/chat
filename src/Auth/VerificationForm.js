import React, { Fragment, useEffect, useState } from 'react';
import useForm from './useForm.js';
import useOAuth from './useOAuth.js';
import Modal from '../Modal/Modal.js';
import * as firebase from 'firebase';
import './SignInWithEmailForm.css';
import './VerificationForm.css';

const VerificationForm = props => {

  const { setSelection, authEmail, handleClose, oAuthResponse, dead, setAuthEmail, isAuthLinkSent, initProvider, getOAuthProvider, requestOAuth } = props;
  const formCallback = (payload, clearForm) => {
    // console.log(payload.email);
    setAuthEmail(payload.email);
    clearForm();
  };
  const {
    handleSubmit,
    handleChange,
    authFormErrors,
    authFormValues
  } = useForm(formCallback);
  const { displayName, email, password } = authFormValues;
  const { displayNameError, emailError, passwordError } = authFormErrors;

  // const storage = sessionStorage.getItem('isDuplicate');
  // const [isDuplicate, setIsDuplicate] = useState(sessionStorage.getItem('isDuplicate'));
  const [chooseAuth, setChooseAuth] = useState(true);
  const [oAuthProvider, setOauthProvider] = useState(true);
  const [dialog, setDialog] = useState('Please choose a sign in method.');
  const [newUser, setNewUser] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [shouldMerge, setShouldMerge] = useState(false);
  const [authMethods, setAuthMethods] = useState(false);
  const [verifiedInstance, setVerifiedInstance] = useState(false);
  const [targetInstance, setTargetInstance] = useState(false);

  useEffect(() => {
    if (!dead && oAuthResponse) {
      const { code, ...rest } = oAuthResponse;
      const initProvider = rest.credential.providerId;
      if (code === 'auth/account-exists-with-different-credential') {
        const pendingCred = rest.credential;
        firebase.auth().fetchSignInMethodsForEmail(rest.email)
          .then(methods => {
            const oldInstance = getOAuthProvider(methods[0]);
            const newInstance = getOAuthProvider(initProvider);
            setVerifiedInstance(oldInstance);
            setTargetInstance(newInstance);
            console.log(oldInstance, newInstance);
            setDialog(`Looks like you already have an account, cool! Would you like to sign in with ${methods[0]} or enable ${initProvider} servives for ${rest.email}?`);
            setShouldMerge(true);
            return;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        console.log(code, rest);
      }
    }
    if (!dead && isAuthLinkSent) {
      setWaiting(true);
    }
    if (sessionStorage.getItem('isDuplicate') === "true") {
      console.log('yeah yiu dd ut');
    }
    return () => {
      // sessionStorage.setItem('isDuplicate', "false");
    };
  }, [oAuthResponse, isAuthLinkSent]);

  // console.log('props', setSelection, authEmail, handleClose);

  const displayNameInput = (
    <div className="formGroußp verificationFormGroup">
      <p className="errorMessage">{displayNameError}</p>
      <input
        className="input displaynameInput"
        type="text"
        name="displayName"
        placeholder="e.g., mykey_42"
        value={displayName || ''}
        onChange={handleChange}
      />
    </div>
  );

  const emailInput = (
    <div className="formGroup emailFormGroup">
      <p className="errorMessage">{emailError}</p>
      <input
        className="input emailInput"
        type="email"
        name="email"
        placeholder="email"
        value={email || ''}
        onChange={handleChange}
      />
    </div>
  );

  const passwordInput = (
    <div className="formGroup passwordFormGroup">
      <p className="errorMessage">{passwordError}</p>
      <input
        className="input passwordInput"
        type="password"
        name="password"
        placeholder="password"
        value={password || ''}
        onChange={handleChange}
      />
    </div>
  );

  const verificationButton = (
    <button
      className="verificationButton"
      type="submit"
      disabled={false}>
      complete registration
    </button>
  );

  const emailAuthButton = (
    <button
      className="signInWithEmailButton"
      type="submit"
      disabled={false}>
      send dynamic link
    </button>
  );

  const Google = (
    <img
      className="googleButton"
      src={require('../assets/btn_google_signin_dark_normal_web@2x.png')}
      alt=""
      onClick={() => setSelection(verifiedInstance[0], verifiedInstance[1])}
    />
  );

  const GitHub = (
    <button
      className="signInWithEmailButton"
      alt=""
      onClick={() => setSelection('github.com')}>
      github
    </button>
  );

  const Facebook = (
    <button
      className="signInWithEmailButton"
      alt=""
      onClick={() => setSelection('facebook.com')}>
      facebook
    </button>
  );

  const disclaimerEtc = (
    <p className="toggleFormLink">
      We prefer Google. <span>Here's why.</span>
    </p>
  );

  const authProviders = (
    <Fragment>
      {GitHub}
      {Facebook}
      {Google}
    </Fragment>
  );

  const authDialog = (
    <p>{dialog}</p>
  );

  const verificationForm = (
    <Modal show={true} handleClose={handleClose}>
      <form className="verificationFormComponent" onSubmit={handleSubmit}>
        <fieldset className="verificationFieldset">
          <legend className="verificationLegend"><p className="appNameAtAuth">Potato</p></legend>
          <div className="parentFlex">
            {authDialog}
            {targetInstance[2]}
            {shouldMerge ? null : null}
            {authProviders}
            {disclaimerEtc}
          </div>
        </fieldset>
      </form>
    </Modal>
  );

  return verificationForm;
}

export default VerificationForm;
