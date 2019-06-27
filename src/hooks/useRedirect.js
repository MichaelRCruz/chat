import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

const useRedirect = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [redirectError, setRedirectError] = useState(null);
  const [redirectLoading, setRedirectLoading] = useState(true);
  const [isNew, setIsNew] = useState(null);
  async function fetchMethods() {
    try {
      await firebase.auth().getRedirectResult().then(result => {
        if (result.credential) {
          const isNew = result.additionalUserInfo.isNewUser
          setIsNew(isNew);
          setUserInfo(result.user);
          const token = result.credential.accessToken;
          setAccessToken(token);
        }
      }).catch(error => {
        setRedirectLoading(false);
        setRedirectError(error);
      });
    } catch (error) {
      setRedirectLoading(false);
      setRedirectError(error);
    }
    setRedirectLoading(false);
  }
  useEffect(() => {
    fetchMethods();
    return () => firebase.auth().off();
  }, []);
  return { redirectLoading, userInfo, accessToken, redirectError, isNew };
};

export default useRedirect;
