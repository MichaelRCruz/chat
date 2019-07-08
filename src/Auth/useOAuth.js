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

  // const getEmailMethods = email => {
  //   firebase.auth().fetchSignInMethodsForEmail(email)
  //     .then(methods => {
  //       if (methods[0] === 'password') {
  //         // setOAuthStatus({ loading: true, status: 'RECOVERING' });
  //         setMethods(methods);
  //       }
  //     })
  //     .catch(error => {
  //       // setOAuthStatus({ loading: false, status: 'FAULT' });
  //       setOAuthError(error);
  //     });
  // };

  const getOAuthProvider = providerId => {
  	switch (providerId) {
  		case 'google.com':
  			return ['signInWithRedirect', new firebase.auth.GoogleAuthProvider(), 'Google'];
  		case 'github.com':
  			return ['signInWithPopup', new firebase.auth.GithubAuthProvider(), 'GitHub'];
      case 'facebook.com':
  			return ['signInWithRedirect', new firebase.auth.FacebookAuthProvider(), 'Facebook'];
  		default:
  		  return 'auth provider selection is not present';
  	}
  }

  const requestOAuth = async (pendingCred) => {
    if (selection) {
      // setInitProvider(authInstance[2]);
      const authInstance = await getOAuthProvider(selection);
      await firebase.auth()[authInstance[0]](authInstance[1])
        .then(res => {
          // setOAuthStatus({ loading: true, status: 'READY' });
          setOAuthResponse(res);
          setSelection(false);
          if (pendingCred) res.user.linkAndRetrieveDataWithCredential(pendingCred)
            .then(function(usercred) {
              // GitHub account successfully linked to the existing Firebase user.
              console.log('you did the link', usercred);
            });
        })
        .catch(async error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            // sessionStorage.setItem('isDuplicate', "true");
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
    // sessionStorage.setItem('isDuplicate', "false");
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
    setIsLoading,
    requestOAuth,
    selection,
    getOAuthProvider
    // oAuthStatus,
    // setOAuthStatus
  };
};

export default useOAuth;
