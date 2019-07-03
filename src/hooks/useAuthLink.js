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

  const sendAuthLink = async email => {
    return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        setIsAuthLinkSent(true);
      })
      .catch(error => {
        setAuthLinkError(error);
      });
  };

  useEffect(() => {
    if (authEmail) sendAuthLink(authEmail);
    return () => {
      setAuthEmail(false);
      setIsAuthLinkSent(false);
    }
  }, [authEmail]);

  return {
    authLinkError,
    sendAuthLink,
    authEmail,
    setAuthEmail,
    isAuthLinkSent,
    setIsAuthLinkSent
  };
};

export default useAuthLink;
