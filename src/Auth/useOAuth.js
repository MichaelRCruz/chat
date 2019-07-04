import { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState(false);
  const [oAuthResponse, setOAuthResponse] = useState(false);
  const [methods, setMethods] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [additionalUserInfo, setAdditionalUserInfo] = useState(false);
  const [oAuthError, setOAuthError] = useState(false);
  const [isOAuthCanceled, setIsOAuthCanceled] = useState(false);
  const [isOAuthBusy, setIsOAuthBusy] = useState(false);
  // const [oAuthStatus, setOAuthStatus] = useState({ loading: false, status: 'READY' });
  // const [loading, setLoading] = useState(true);

  const getEmailMethods = email => {
    return firebase.auth().fetchSignInMethodsForEmail(email)
      .then(methods => {
        if (methods[0] === 'password') {
          // setOAuthStatus({ loading: true, status: 'RECOVERING' });
          return methods;
        }
      })
      .catch(error => {
        // setOAuthStatus({ loading: false, status: 'FAULT' });
        setOAuthError(error);
      });
  };

  const requestOAuth = async () => {
    if (selection) {
      const authInstance = await getOAuthProvider(selection);
      await firebase.auth().signInWithRedirect(authInstance)
        .then(res => {
          // setOAuthStatus({ loading: true, status: 'READY' });
          setOAuthResponse(res);
          setSelection(false);
        })
        .catch(async error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            // setOAuthStatus({ loading: true, status: 'CONFLICTED' });
            const methods = await getEmailMethods(error.email);
            // setOAuthStatus({ loading: true, status: 'READY' });
            if (methods) setMethods(methods);
            setOAuthResponse(error);
          }
          // setOAuthStatus({ loading: false, status: 'FAULT' });
          setOAuthError(error);
        });
    } else {
      firebase.auth().getRedirectResult()
        .then(result => {
          if (result.credential) {
            // setOAuthStatus({ loading: true, status: 'SUCCESS' });
            const { additionalUserInfo } = result;
            const { isNewUser } = additionalUserInfo;
            setAdditionalUserInfo(additionalUserInfo);
            setIsNewUser(isNewUser);
            if (result) setOAuthResponse(result);

          }
        })
        .catch(error => {
          // setOAuthStatus({ loading: false, status: 'FAULT' });
          setOAuthError(error);
        });
    }
  };

  useEffect(() => {
    requestOAuth();
    return () => {
      setSelection(false);
    }
  }, [selection]);

  return {
    oAuthError,
    oAuthResponse,
    setOAuthResponse,
    setSelection,
    methods,
    setIsNewUser,
    setAdditionalUserInfo,
    additionalUserInfo,
    setMethods,
    isOAuthCanceled,
    setIsOAuthCanceled,
    isLoading,
    setIsLoading
    // oAuthStatus,
    // setOAuthStatus
  };
};

const getOAuthProvider = providerId => {
	switch (providerId) {
		case 'GOOGLE_SIGN_IN_METHOD':
			return new firebase.auth.GoogleAuthProvider();
		case 'GITHUB_SIGN_IN_METHOD':
			return new firebase.auth.GithubAuthProvider();
		default:
		  return 'auth provider selection is not present';
	}
}

export default useOAuth;
