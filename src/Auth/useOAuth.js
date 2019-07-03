import { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useOAuth = () => {
  const [selection, setSelection] = useState(false);
  const [oAuthResponse, setOAuthResponse] = useState(false);
  const [methods, setMethods] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [additionalUserInfo, setAdditionalUserInfo] = useState(false);
  const [oAuthError, setOAuthError] = useState(false);
  const [isOAuthCanceled, setIsOAuthCanceled] = useState(false);

  const getEmailMethods = email => {
    return firebase.auth().fetchSignInMethodsForEmail(email)
      .then(methods => {
        if (methods[0] === 'password') {
          return methods;
        }
      })
      .catch(error => {
        setOAuthError(error);
      });
  };

  const requestOAuth = async () => {
    if (selection) {
      const authInstance = await getOAuthProvider(selection);
      await firebase.auth().signInWithRedirect(authInstance)
        .then(res => {
          setOAuthResponse(res);
          setSelection(false);
        })
        .catch(async error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            const methods = await getEmailMethods(error.email);
            setMethods(methods);
            setOAuthResponse(error);
          }
          setOAuthError(error);
        });
    } else {
      await firebase.auth().getRedirectResult()
        .then(res => {
          const { additionalUserInfo } = res;
          const { isNewUser } = additionalUserInfo;
          setAdditionalUserInfo(additionalUserInfo);
          setIsNewUser(isNewUser);
          setOAuthResponse(res);
        })
        .catch(error => {
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
    setIsOAuthCanceled
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
