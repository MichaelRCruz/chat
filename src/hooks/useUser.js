import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  useEffect(() => {
    const unlisten = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
        setUid(this.userId);
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      unlisten();
    }
  }, []);
  return { user, uid };
};

export default useUser;
