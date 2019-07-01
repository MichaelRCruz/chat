import { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useOAuth = () => {

  const [selection, setSelection] = useState(null);
  const [isOAuthCanceled, setIsOAuthCanceled] = useState(false);
  const [oAuthResponse, setOAuthResponse] = useState(null);
  const [redirectResult, setRedirectResult] = useState(null);
  const [oAuthError, setOAuthError] = useState(null);
  const [emailMethods, setEmailMethods] = useState(null);

  function getEmailMethods(email) {
    return firebase.auth().fetchSignInMethodsForEmail(email)
      .then(methods => {
        if (methods[0] === 'password') {
          setEmailMethods(methods);
        }
      })
      .catch(error => {
        setOAuthError(error);
      });
  };

  function requestOAuth() {
    if (selection) {
      const authInstance = getOAuthProvider(selection);
      firebase.auth().signInWithRedirect(authInstance)
        .then(res => {
          setOAuthResponse(res);
          setSelection(null);
        })
        .catch(error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            setOAuthResponse(error);
            getEmailMethods(error.email);
          }
          setOAuthError(error);
        });
    } else {
      firebase.auth().getRedirectResult()
        .then(res => {
          setOAuthResponse(res);
        })
        .catch(error => {
          setOAuthError(error);
        });
    }
  };

  useEffect(() => {
    if (!isOAuthCanceled) requestOAuth();
  }, [selection]);

  return { oAuthError, oAuthResponse, setSelection, setIsOAuthCanceled, redirectResult };
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
