import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

const useRedirect = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [redirectError, setRedirectError] = useState(null);
  useEffect(() => {
    const unlisten = firebase.auth().getRedirectResult().then(result => {
      if (result.credential) {
        const token = result.credential.accessToken;
        setAccessToken(token);
      }
      const user = result.user;
      setUserInfo(user);
    }).catch(error => {
      setRedirectError(error);
    });
    return () => {
      unlisten();
    }
  }, []);
  return [accessToken, userInfo, redirectError];
};

export default useRedirect;
