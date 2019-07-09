import React, { Fragment, useEffect, useState } from 'react';
import useForm from './useForm.js';
import useOAuth from './useOAuth.js';
import Modal from '../Modal/Modal.js';
import * as firebase from 'firebase';
import './SignInWithEmailForm.css';
import './VerificationForm.css';

const VerificationForm = props => {

  const { setSelection, authEmail, handleClose, oAuthResponse, dead, setAuthEmail, isAuthLinkSent, initProvider, getOAuthProvider, linkAccounts, unLinkAccount, redirectToWaiting, needsConfirmation } = props;
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
  const [authMode, setAuthMode] = useState('registration');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCred, setPendingCred] = useState(false);

  useEffect(() => {
    if (!dead && oAuthResponse) {
      const { code, additionalUserInfo, ...rest } = oAuthResponse;
      const isNewUser = additionalUserInfo ? additionalUserInfo.isNewUser : false;
      const initProvider = rest.credential.providerId;
      if (code === 'auth/account-exists-with-different-credential') {
        const pendingCred = rest.credential;
        setPendingCred(pendingCred)
        firebase.auth().fetchSignInMethodsForEmail(rest.email)
          .then(methods => {
            const oldInstance = getOAuthProvider(methods[0]);
            const newInstance = getOAuthProvider(initProvider);
            setVerifiedInstance(oldInstance);
            setTargetInstance(newInstance);
            setDialog(`Looks like you already have an account, cool! Would you like to sign in with ${methods[0]} or enable ${initProvider} servives for ${rest.email}?`);
            setAuthMode('shouldMerge');
            return;
          })
          .catch(error => {
            console.log(error);
          });
      } else if (isNewUser) {
        setDialog('Welcome! Create a display name and a password for extra security :)');
        setAuthMode('newUser');
      }
    } else if (isAuthLinkSent && !needsConfirmation) {
      redirectToWaiting();
    }
    return () => {
      setAuthMode('registration');
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

  const oAuthButton = inst => {
    return (
      <button
        className="signInWithEmailButton"
        alt=""
        onClick={() => setSelection(inst)}>
        <p>{inst}</p>
      </button>
    );
  }

  const disclaimerEtc = (
    <p className="toggleFormLink">
      We prefer Google. <span>Here's why.</span>
    </p>
  );

  const authDialog = (
    <p>{dialog}</p>
  );

  const muhButtons = ['google.com', 'facebook.com', 'github.com'].map(authProvider => {
    return (
      <li key={authProvider}>
        {oAuthButton(authProvider)}
      </li>
    );
  });

  const linkAccountsButton = (
    <button
      className="signInWithEmailButton"
      alt=""
      onClick={() => linkAccounts(verifiedInstance, pendingCred)}>
      link account
    </button>
  );

  const unLinkAccountButton = (
    <button
      className="signInWithEmailButton"
      alt=""
      onClick={() => unLinkAccount()}>
      unlink account
    </button>
  );

  const userDetails = (
    <Fragment>
      {displayNameInput}
      {emailInput}
      {passwordInput}
    </Fragment>
  );

  const verificationForm = (
    <Modal show={true} handleClose={handleClose}>
      <form className="verificationFormComponent" onSubmit={handleSubmit}>
        <fieldset className="verificationFieldset">
          <legend className="verificationLegend"><p className="appNameAtAuth">Potato</p></legend>
          <div className="parentFlex">
            {authDialog}
            {authMode === 'waiting' ? userDetails : null}
            {authMode === 'registration' ? emailInput : null}
            {authMode === 'registration' ? emailAuthButton : null}
            {authMode === 'registration' ? <ul>{muhButtons}</ul> : null}
            {authMode === 'newUser' ? userDetails : null}
            {authMode === 'shouldMerge' ? oAuthButton(verifiedInstance[3]) : null}
            {authMode === 'shouldMerge' ? linkAccountsButton : null}
            {unLinkAccountButton}
            {disclaimerEtc}
          </div>
        </fieldset>
      </form>
    </Modal>
  );

  return verificationForm;
}

export default VerificationForm;
