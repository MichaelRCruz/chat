import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

const useSignInMethods = emailAddr => {
  const [email, setEmail] = useState(emailAddr);
  const [methods, setMethods] = useState(null);
  const [signInMethodError, setSignInMethodError] = useState(null);
  useEffect(() => {
    const uncare = firebase.auth().fetchSignInMethodsForEmail().then(methods => {
      if (methods[0] === 'password') {
        setMethods(methods);
      }
    });
    // return () => {
    //   uncare();
    // }
  });
  return [email, methods, signInMethodError];
};

export default useSignInMethods;
