import React, { Component, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import SessionContext from './SessionContext.js';

const OAuth = options => {

  const auth = firebase.auth;
  const gitHubProvider = new firebase.auth.GithubAuthProvider();
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  signInWithRedirect = provider => {
    return auth.signInWithRedirect(provider);
  });
  fetchSignInMethodsForEmail = email => {
    return auth.fetchSignInMethodsForEmail(email);
  };
  linkAndRetrieveDataWithCredential = pendingCred => {
    return auth.linkAndRetrieveDataWithCredential(pendingCred);
  };
  linkWithCredential = pendingCred => {
    return user.linkWithCredential(pendingCred);
  };
  handleAccountMerge = (cred, email) => {
    console.log('handling merge', cred, email);
  };

  handleOauth = async provider => {
    const response = await this.signInWithRedirect(provider);
    const authError = response.catch(error => error);
    if (authError.code === 'auth/account-exists-with-different-credential') {
      // return this.handleAccountMerge(pendingCred);
      const { pendingCred: credential, pendingEmail: email } = authError;
      const methods = await this.fetchSignInMethodsForEmail(email);
      return console.log('other oauth detected with: ' + email, methods);
    } else {
      const provider = await getProviderForProviderId(methods[0]);
      const res = await this.signInWithRedirect(provider);
      const user = res.user;
      return user.this.linkAndRetrieveDataWithCredential(pendingCred);
    }
  };
  return (
    null;
  );

};

export default withRouter(App);
