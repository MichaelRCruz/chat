import React, { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

const useAuthLink = inputEmail => {
  const [email, setEmail] = useState(inputEmail);
  const [linkError, setLinkError] = useState(null);
  const [actionCodeSettings, setActionCodeSettings] = useState({
    url: `${process.env.REACT_APP_HTTP_URL}/auth/registration`,
    handleCodeInApp: true,
    dynamicLinkDomain: 'coolpotato.page.link'
  });
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: null,
  });
  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      try {
        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
          .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            setEmail(null);
          })
          .catch(error => {
            setLinkError(error);
          });
      } catch (error) {
        if (!didCancel) {
          setLinkError(error);
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [email]);
  return [state, setEmail];
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
			throw new Error('auth provider email is not present');
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
      throw new Error();
  }
};

export default useAuthLink;
