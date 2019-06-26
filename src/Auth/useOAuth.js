import React, { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useOAuth = authSelection => {
  const [oAuthRequest, setOAuthRequest] = useState(authSelection);
  const [submitted, setSubmitted] = useState(false);
  const [state, setMuhState] = useState({
		authSelection,
		isDuplicate: null,
		isError: null,
		isLoading: false,
		isNew: true,
		payload: null,
		type: null
  });
	useEffect(() => {
		let didCancel = false;
    async function requestAuth() {
      setMuhState({ type: 'INIT' });
      try {
				const authInstance = selectionSwitch(oAuthRequest);
        const payload = await firebase.auth().signInWithRedirect(authInstance);
        if (!didCancel) {
          setMuhState({ type: 'SUCCESS', payload, ...state });
        }
				// console.log(oAuthRequest);
      } catch (error) {
        if (!didCancel) {
          setMuhState({ type: 'FAILURE', error, ...state });
        }
      }
    };
		requestAuth();
    return () => { didCancel = true; };
  }, [oAuthRequest, setOAuthRequest]);
  return [oAuthRequest, setOAuthRequest, state];
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
