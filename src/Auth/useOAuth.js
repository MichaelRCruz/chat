import React, { useState, useEffect, useReducer } from 'react';
import * as firebase from 'firebase';

// const useOAuth = authSelection => {
//   const [oAuthRequest, setOAuthRequest] = useState(authSelection);
//   const [submitted, setSubmitted] = useState(false);
//   const [state, setMuhState] = useState({
// 		authSelection,
// 		isDuplicate: null,
// 		isError: null,
// 		isLoading: false,
// 		isNew: null,
// 		payload: null,
// 		type: null
//   });
// 	useEffect(() => {
// 		let didCancel = false;
//     async function requestAuth() {
//       setMuhState({ type: 'INIT' });
//       try {
// 				const authInstance = selectionSwitch(oAuthRequest);
//         const payload = await firebase.auth().signInWithRedirect(authInstance);
//         if (!didCancel) {
//           setMuhState({ type: 'SUCCESS', payload, ...state });
//         }
//       } catch (error) {
//         if (!didCancel) {
//           setMuhState({ type: 'FAILURE', error, ...state });
//         }
//       }
//     };
// 		requestAuth();
//     return () => { didCancel = true; };
//   }, [oAuthRequest, setOAuthRequest]);
//   return [oAuthRequest, setOAuthRequest, state];
// };
//
// const gitHubProvider = new firebase.auth.GithubAuthProvider();
// const googleProvider = new firebase.auth.GoogleAuthProvider();
// const selectionSwitch = providerId => {
// 	switch (providerId) {
// 		case 'GOOGLE_SIGN_IN_METHOD':
// 			return new firebase.auth.GoogleAuthProvider();
// 		case 'GITHUB_SIGN_IN_METHOD':
// 			return new firebase.auth.GithubAuthProvider();
// 		default:
// 			throw new Error('auth provider selection is not present');
// 	}
// };

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
      // dispatch({ type: 'FETCH_INIT' });

      try {
        firebase.auth().getRedirectResult().then(result => {
          if (result.credential) {
            // This gives you a Google Access Token.
            var token = result.credential.accessToken;
            dispatch({ type: 'FETCH_INIT', token });
          }
          var user = result.user;
        });
        const authInstance = selectionSwitch(selection);
        const res = await firebase.auth().signInWithRedirect(authInstance);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: res });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
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
			throw new Error('auth provider selection is not present');
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

export default useOAuth;
