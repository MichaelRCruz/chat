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
  const [authToast, setAuthToast] = useState(false);
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
  			return {method: 'signInWithRedirect', instance: new firebase.auth.GoogleAuthProvider(), name: 'Google', providerId: 'google.com'};
  		case 'github.com':
  			return {method: 'signInWithPopup', instance: new firebase.auth.GithubAuthProvider(), name: 'GitHub', providerId: 'github.com'};
      case 'facebook.com':
  			return {method: 'signInWithRedirect', instance: new firebase.auth.FacebookAuthProvider(), name: 'Facebook', providerId: 'facebook.com'}
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

  const linkAccounts = async (initProvider, pendingCred) => {
    const { method, instance } = await getOAuthProvider(initProvider);
    const sessionCred = JSON.stringify(pendingCred);
    sessionStorage.setItem('pendingCred', sessionCred);
    const cred = sessionStorage.getItem('pendingCred');
    const parsedCred = firebase.auth.AuthCredential.fromJSON(cred);
    // const parsedCred = credJson.fromJSON();
    // console.log(credJson);
    // console.log(JSON.parse(cred));
    // debugger;
    firebase.auth().signInWithPopup(instance).then(result => {
      // Remember that the user may have signed in with an account that has a different email
      // address than the first one. This can happen as Firebase doesn't control the provider's
      // sign in flow and the user is free to login using whichever account he owns.
      // Step 4b.
      // Link to GitHub credential.
      // As we have access to the pending credential, we can directly call the link method.

      result.user.linkAndRetrieveDataWithCredential(parsedCred).then(function(usercred) {
        // GitHub account successfully linked to the existing Firebase user.
        console.log(usercred);
      }).catch(error => {
        console.log(error);
      });
    });
  }

  const updateUserDetails = async payload => {
    const user = await firebase.auth().currentUser;
    const {  displayName, password } = payload;
    let toast = {};
    await user.updateProfile({
      displayName
    }).then(function(res) {
      toast['displayName'] = 'displayName updated';
    }).catch(function(error) {
      toast['error'] = 'displayName not set';
    });
    await user.updatePassword(password).then(function(res) {
      toast['password'] = 'password updated';
    }).catch(function(error) {
      toast['error'] = 'displayName not set';
    });
    setAuthToast(toast);
    // user.updateEmail("user@example.com").then(function() {
    //   // Update successful.
    // }).catch(function(error) {
    //   // An error happened.
    // });
    console.log(user, payload);
  }

  const requestOAuth = async (pendingCred) => {
    if (selection) {
      const authInstance = await getOAuthProvider(selection);
      localStorage.setItem('potatoStorage', 'redirecting');
      await firebase.auth().signInWithRedirect(authInstance.instance)
        // .then(res => {
        //   // setOAuthStatus({ loading: true, status: 'READY' });
        //   // setLinkRes(this.res);
        //   // setOAuthResponse(res);
        //   // setSelection(false);
        // })
        // .catch(async error => {
        //   // if (error.code === 'auth/account-exists-with-different-credential') {
        //   //   // sessionStorage.setItem('isDuplicate', "true");
        //     setOAuthResponse(error);
        //   // }
        //   // setOAuthStatus({ loading: false, status: 'FAULT' });
        //   setOAuthError({error, source: 'requestOAuth'});
        // });
    }
  };

  useEffect(() => {
    // sessionStorage.setItem('isDuplicate', "false");
    if (selection) requestOAuth();
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
        if (error.code === 'auth/account-exists-with-different-credential') {
          // sessionStorage.setItem('isDuplicate', "true");
          // const pendingCred = error.credential;
          // const email = error.email;
          // // const sessionCred = JSON.stringify(error.credential);
          // sessionStorage.setItem('sessionCred', error.credential);
          setOAuthResponse(error);
        }
        setOAuthError({error, source: 'requestOAuth'});
      });
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
    updateUserDetails,
    authToast
    // oAuthStatus,
    // setOAuthStatus
  };
};

export default useOAuth;
