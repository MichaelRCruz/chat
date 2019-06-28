import React, { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useOAuth = authSelection => {
  const [selection, setSelection] = useState(authSelection);
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      try {
        firebase.auth().getRedirectResult().then(result => {
          dispatch({ type: 'FETCH_INIT', token });
          if (result.credential) {
            // This gives you a Google Access Token.
            var token = result.credential.accessToken;
          }
          dispatch({ type: 'FETCH_PENDING', payload: result });
        });
        const authInstance = selectionSwitch(selection);
        const res = await firebase.auth().signInWithRedirect(authInstance);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS' });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE', error, isError: true });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [selection, setSelection]);

  return [state, setSelection];
};

const gitHubProvider = new firebase.auth.GithubAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const selectionSwitch = providerId => {
	switch (providerId) {
		case 'GOOGLE_SIGN_IN_METHOD':
			return new firebase.auth.GoogleAuthProvider();
		case 'GITHUB_SIGN_IN_METHOD':
			return new firebase.auth.GithubAuthProvider();
		default:
		  return 'auth provider selection is not present';
	}
}

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
  }
};

export default useOAuth;
