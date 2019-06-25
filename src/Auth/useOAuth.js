import React, { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useOAuth = authSelection => {
  const [oAuthRequest, setOAuthRequest] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [state, dispatch] = useReducer(oAuthReducer, {
    isLoading: false,
    isError: false,
    data: null
  });
	useEffect(authSelection => {
		let didUnmount = false;
    const requestAuth = async () => {
      dispatch({ type: 'INIT' });
      try {
				const authInstance = await selectionSwitch(oAuthRequest);
        const payload = await firebase.auth().signInWithRedirect(authInstance);
        if (!didUnmount) {
          dispatch({ type: 'SUCCESS', payload });
        }
				// console.log(oAuthRequest);
      } catch (error) {
        if (!didUnmount) {
          dispatch({ type: 'FAILURE', error });
        }
      }
    };
    if (oAuthRequest) requestAuth();
    return () => {
      didUnmount = true;
			setOAuthRequest(null);
    };
  }, [oAuthRequest, setOAuthRequest]);
  return [oAuthRequest, setOAuthRequest];
};

const oAuthReducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return { ...state, isLoading: true, isError: false };
    case 'SUCCESS':
      return { ...state, isLoading: false, isError: false, data: action.payload };
    case 'FAILURE':
      return { ...state, isLoading: false, isError: true, error: action.error };
    default:
      throw new Error();
  };
};

const gitHubProvider = new firebase.auth.GithubAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const selectionSwitch = selection => {
	switch (selection) {
		case 'GOOGLE':
			return new firebase.auth.GoogleAuthProvider();
		case 'GITHUB':
			return new firebase.auth.GithubAuthProvider();
		default:
			throw new Error('auth provider selection is not present');
	}
};

export default useOAuth;
