import React, { Component, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import SessionContext from '../SessionContext.js';
import * as firebase from 'firebase';

class OAuth {
  constructor(firebase) {
    this.auth = firebase.auth();
    this.gitHubProvider = new firebase.auth.GithubAuthProvider();
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
  }
  signInWithRedirect = provider => {
    return this.auth.signInWithRedirect(provider);
  };
  fetchSignInMethodsForEmail = email => {
    return this.auth.fetchSignInMethodsForEmail(email);
  };
  linkWithCredential = pendingCred => {
    return this.auth.linkWithCredential(pendingCred);
  };
  // getRedirectResult = crendential => {
  //   return this.auth.getRedirectResult(credential);
  // };
  handleOauth = async provider => {
    const result = await this.signInWithRedirect(provider);
    const authError = await result.catch(error => error);
    if (authError) {
      return authError;
    } else {
      return result;
    }
  };
};

export default OAuth;
