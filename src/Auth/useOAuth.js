import { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useOAuth = () => {
  const [selection, setSelection] = useState(false);
  const [isOAuthComplete, setIsOAuthComplete] = useState(false);
  const [oAuthResponse, setOAuthResponse] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [additionalUserInfo, setAdditionalUserInfo] = useState(false);
  const [oAuthError, setOAuthError] = useState(null);
  const [emailMethods, setEmailMethods] = useState(null);
  const [oAuthHookError, setOAuthHookError] = useState(null);

  const getEmailMethods = (email) => {
    firebase.auth().fetchSignInMethodsForEmail(email)
      .then(methods => {
        if (methods[0] === 'password') {
          setEmailMethods(methods);
        }
      })
      .catch(error => {
        setOAuthError(error);
      });
  };
  const requestOAuth = () => {
    if (selection) {
      const authInstance = getOAuthProvider(selection);
      firebase.auth().signInWithRedirect(authInstance)
        .then(res => {
          setOAuthResponse(res);
          setSelection(null);
        })
        .catch(error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            getEmailMethods(error.email);
            setOAuthResponse(error);
          }
          setOAuthError(error);
        });
    } else {
      firebase.auth().getRedirectResult()
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

  return { setOAuthHookError, oAuthError, oAuthResponse, setOAuthResponse, setSelection, emailMethods, isOAuthComplete, setIsNewUser, setAdditionalUserInfo, additionalUserInfo, setEmailMethods };
};

const gitHubProvider = new firebase.auth.GithubAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
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
