import React, { useState, useEffect } from 'react';
import SessionContext from '../SessionContext.js';
import * as firebase from 'firebase';

const useOAuth = (callback, authProvider) => {
  const [oAuthUser, setOAuthUser] = useState(null);
	useEffect(() => callback());

  const gitHubProvider = new firebase.auth.GithubAuthProvider();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const signInWithRedirect = authProvider => {
    return firebase.auth.signInWithRedirect(authProvider);
  };
  const fetchSignInMethodsForEmail = email => {
    return firebase.auth.fetchSignInMethodsForEmail(email);
  };
  const linkAndRetrieveDataWithCredential = pendingCred => {
    return firebase.auth.linkAndRetrieveDataWithCredential(pendingCred);
  };
  const linkWithCredential = (user, pendingCred) => {
    return user.linkWithCredential(pendingCred);
  };
  const handleAccountMerge = (cred, email) => {
    console.log('handling merge', cred, email);
  };
  const testHandler = foo => {
    console.log(foo);
  };

  const response = await this.signInWithRedirect(authProvider);
  const authError = response.catch(error => error);
  if (authError.code === 'auth/account-exists-with-different-credential') {
    // return this.handleAccountMerge(pendingCred);
    const { pendingCred: credential, pendingEmail: email } = authError;
    const methods = await this.fetchSignInMethodsForEmail(email);
    // return console.log('other oauth detected with: ' + email, methods);
		debugger;
  } else {
    // const authProvider = await getProviderForProviderId(methods[0]);
    const { user, usercred } = await this.signInWithRedirect(authProvider);
    const oAuthUser = user.linkAndRetrieveDataWithCredential(usercred);
		setOAuthUser(oAuthUser);
  }

};

export default useOAuth;
