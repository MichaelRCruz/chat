import { useState, useEffect } from 'react';
import * as firebase from 'firebase';

const useAuthLink = () => {

  const [authEmail, setAuthEmail] = useState(null);
  const [authLinkError, setAuthLinkError] = useState(null);
  const [isAuthLinkSent, setIsAuthLinkSent] = useState(false);
  const [actionCodeSettings, setActionCodeSettings] = useState({
    url: `http://localhost:3000/auth/registration`,
    handleCodeInApp: true,
    dynamicLinkDomain: 'coolpotato.page.link'
  });

  const sendAuthLink = emailInput => {
    try {
      firebase.auth().sendSignInLinkToEmail(emailInput, actionCodeSettings)
      .then(() => {
        // window.localStorage.setItem('potatoEmail', email);
        setIsAuthLinkSent(true);
      })
      .catch(error => {
        setAuthLinkError(error);
      });
    } catch(error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   setIsLinkSent(true);
  // }, [email]);

  return { authEmail, setAuthEmail, sendAuthLink, authLinkError, isAuthLinkSent };
};

export default useAuthLink;
