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
  const [linkRes, setLinkRes] = useState(false);
  const [unlinkSuccess, setUnlinkSuccess] = useState(false);
  const [authProviderInstances, setAuthproviderinstance] = useState({
    'google': {method: 'signInWithRedirect', instance: () => new firebase.auth.GoogleAuthProvider(), name: 'Google', providerId: 'google.com', assetPath: '../assets/btn_google_light_focus_ios.svg'},
    'facebook': {method: 'signInWithPopup', instance: () => new firebase.auth.GitHubAuthProvider(), name: 'GitHub', providerId: 'github.com', assetPath: '../assets/btn_google_light_focus_ios.svg'},
    'github': {method: 'signInWithRedirect', instance: () => new firebase.auth.FacebookAuthProvider(), name: 'Facebook', providerId: 'facebook.com', assetPath: '../assets/btn_google_light_focus_ios.svg'}
  });

  const getOAuthProvider = async providerId => {
  	switch (providerId) {
  		case 'google.com':
  			return {method: 'signInWithRedirect', instance: await new firebase.auth.GoogleAuthProvider(), name: 'Google', providerId: 'google.com'};
  		case 'github.com':
  			return {method: 'signInWithPopup', instance: await new firebase.auth.GitHubAuthProvider(), name: 'GitHub', providerId: 'github.com'};
      case 'facebook.com':
  			return {method: 'signInWithRedirect', instance: await new firebase.auth.FacebookAuthProvider(), name: 'Facebook', providerId: 'facebook.com'}
  		default:
  		  return 'auth provider selection is not present';
  	}
  }

  const unLinkAccount = async () => {
    const { user, additionalUserInfo } = oAuthResponse;
    // const { providerId } = additionalUserInfo;
    user.unlink('github.com').then(result => {
      setUnlinkSuccess({true: true, result});
    }).catch(function(error) {
      setUnlinkSuccess({true: false, error});
    });
  }

  const linkAccounts = async (verifiedInstance, pendingCred) => {
    // console.log(selection, pendingCred);
    // const authInstance = await getOAuthProvider(selection);
    // console.log(authInstance);
    await firebase.auth()[verifiedInstance.method](verifiedInstance.instance).then(async result => {
      // Remember that the user may have signed in with an account that has a different email
      // address than the first one. This can happen as Firebase doesn't control the provider's
      // sign in flow and the user is free to login using whichever account he owns.
      // Step 4b.
      // Link to GitHub credential.
      // As we have access to the pending credential, we can directly call the link method.
      await result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function(usercred) {
        // GitHub account successfully linked to the existing Firebase user.
        console.log(usercred);
      });
    });
  }

  const requestOAuth = async (pendingCred) => {
    if (selection) {
      // setInitProvider(authInstance[2]);
      const authInstance = await getOAuthProvider(selection);
      await firebase.auth()[authInstance.method](authInstance.instance)
        .then(res => {
          // setOAuthStatus({ loading: true, status: 'READY' });
          setLinkRes(this.res);
          setOAuthResponse(res);
          setSelection(false);
        })
        .catch(async error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            // sessionStorage.setItem('isDuplicate', "true");
            setOAuthResponse(error);
          }
          // setOAuthStatus({ loading: false, status: 'FAULT' });
          setOAuthError({error, source: 'requestOAuth'});
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
          setOAuthError({error, source: 'getredirectresukt'});
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
    getOAuthProvider,
    linkAccounts,
    unLinkAccount,
    authProviderInstances
    // oAuthStatus,
    // setOAuthStatus
  };
};

export default useOAuth;
