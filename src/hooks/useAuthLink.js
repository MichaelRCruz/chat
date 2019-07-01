import { useState, useEffect } from 'react';
import * as firebase from 'firebase';

const useAuthLink = () => {

  const [email, setEmail] = useState(null);
  const [linkError, setLinkError] = useState(null);
  const [linkCanceled, setLinkCanceled] = useState(false);
  const [actionCodeSettings, setActionCodeSettings] = useState({
    url: `http://localhost:3000/auth/registration`,
    handleCodeInApp: true,
    dynamicLinkDomain: 'coolpotato.page.link'
  });

  const sendLink = muhEmail => {
    firebase.auth().sendSignInLinkToEmail(muhEmail, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('potatoEmail', email);
        setEmail(null);
        setLinkCanceled(false);
      })
      .catch(error => {
        setLinkError(error);
        setLinkCanceled(false);
      });
  };

  useEffect(() => {
    return () => {
      if (!linkCanceled) sendLink();
      setLinkCanceled(true);
    };
  }, []);

  return { email, sendLink, linkError, linkCanceled, setLinkCanceled };
};

export default useAuthLink;
