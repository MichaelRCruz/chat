import { useState, useEffect } from 'react';
import * as firebase from 'firebase';

const useAuthLink = () => {

  const [authEmail, setAuthEmail] = useState(false);
  const [authLinkError, setAuthLinkError] = useState(null);
  const [isAuthLinkSent, setIsAuthLinkSent] = useState(false);
  const [actionCodeSettings, setActionCodeSettings] = useState({
    url: `http://localhost:3000/auth/registration`,
    handleCodeInApp: true,
    dynamicLinkDomain: 'coolpotato.page.link'
  });

  const sendAuthLink = email => {
    // setIsAuthLinkSent(true);
    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        // window.localStorage.setItem('potatoEmail', email);
        // setIsAuthLinkSent(true);
      })
      .catch(error => {
        setAuthLinkError(error);
      });
  };

  useEffect(() => {
    if (authEmail) {
      sendAuthLink(authEmail);
      setIsAuthLinkSent(true);
    }
    return () => {
      console.log('authLinkError: ', authLinkError);
      setAuthEmail(false);
      setIsAuthLinkSent(false);
    }
  }, [authEmail]);

  return { authEmail, setAuthEmail, sendAuthLink, authLinkError, isAuthLinkSent, setIsAuthLinkSent };
};

export default useAuthLink;
