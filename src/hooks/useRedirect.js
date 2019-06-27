import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

const useRedirect = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [redirectError, setRedirectError] = useState(null);
  const [redirectLoading, setRedirectLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [isNew, setIsNew] = useState(null);
  const [methods, setMethods] = useState(null);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [methodError, setMethodError] = useState(null);
  async function fetchMethods() {
    try {
      await firebase.auth().getRedirectResult().then(result => {
        if (result.credential) {
          const isNew = result.additionalUserInfo.isNewUser
          const token = result.credential.accessToken;
          setIsNew(isNew);
          setUserInfo(result.user);
          setEmail(result.user.email);
          setAccessToken(token);
        }
      }).catch(error => {
        setRedirectLoading(false);
        setRedirectError(error);
      });
      if (email) {
        await firebase.auth().fetchSignInMethodsForEmail(email).then(methods => {
          if (methods[0] === 'password') {
            setMethods(methods);
          }
        }).catch(error => {
          setMethodsLoading(false);
          setMethodError(error);
        });
      }
    } catch (error) {
      setRedirectLoading(false);
      setRedirectError(error);
      setMethodError(error);
    }
    setRedirectLoading(false);
  }
  useEffect(() => {
    fetchMethods();
  }, [email]);
  return {
    redirectLoading,
    userInfo,
    accessToken,
    isNew,
    methods,
    redirectError,
    methodError,
    email
  };
};

export default useRedirect;
