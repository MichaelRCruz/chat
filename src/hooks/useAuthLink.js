import React, { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useAuthLink = inputEmail => {
  const [email, setEmail] = useState(inputEmail);
  const [linkError, setLinkError] = useState(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [actionCodeSettings, setActionCodeSettings] = useState({
    url: `http://localhost:3000/auth/registration`,
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
            setWasSubmitted(true);
          })
          .catch(error => {
            console.log(error);
            setLinkError(error);
          });
      } catch (error) {
        // setLinkError(error);
        if (!didCancel) {
          setLinkError(error);
        }
      }
    };
    fetchData();
    return () => {
      // setWasSubmitted(true);
      didCancel = true;
    };
  }, [email]);
  return {email, setEmail, setLinkError, wasSubmitted};
};

export default useAuthLink;
