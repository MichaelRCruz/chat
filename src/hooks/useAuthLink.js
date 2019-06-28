import React, { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useAuthLink = inputEmail => {
  const [email, setEmail] = useState(inputEmail);
  const [linkError, setLinkError] = useState(null);
  const [actionCodeSettings, setActionCodeSettings] = useState({
    url: `${process.env.REACT_APP_HTTP_URL}/auth/registration`,
    handleCodeInApp: true,
    dynamicLinkDomain: 'coolpotato.page.link'
  });
  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      try {
        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
          .then(() => {
            window.localStorage.setItem('potatoEmailForSignIn', email);
          })
          .catch(error => {
            setLinkError(error);
          });
      } catch (error) {
        if (!didCancel) {
          setLinkError(error);
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [email]);
  return {email, setEmail, setLinkError};
};

export default useAuthLink;
