import React, { useState, useContext, useEffect } from 'react';
import * as firebase from 'firebase';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import {throttling} from '../utils.js';
import './Users.css';

const Users = () => {

  const { state } = useContext(SessionContext);
  const { activeRoom, user } = state;
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const users = activeRoom.users;
    const onliners = Object.assign({}, users);
    const muhSubs = users ? users : {};
    const subscribers = Object.keys(muhSubs);
    let buffer = [];

    const userThrottler = throttling(() => {
      buffer.forEach((user, index) => {
        onliners[user.uid] = user;
      });
      setSubscribers(Object.values(onliners));
    }, 100);

    const addedRef = firebase.database().ref(`/USERS_ONLINE`);
    addedRef
      .on('child_added', snap => {
        const user = snap.val();
        user.action = 'sup';
        buffer.push(user);
        userThrottler();
      });

    const removedRef = firebase.database().ref(`/USERS_ONLINE`);
    removedRef
      .on('child_removed', async snap => {
        const user = snap.val();
        user.action = 'brb';
        buffer.push(user);
        userThrottler();
      });
    return () => {
      addedRef.off();
      removedRef.off();
    }
  }, [activeRoom, user]);

  const subs = subscribers.map((user, i) => {
    const { photoURL, displayName, action, uid } = user;
    return (
      <li className="onlineUser" key={uid}>
        <div className={"userContainer"}>
          <img
            className="userMenuImage"
            alt="user"
            src={ photoURL || defaultUserImage}
           />
          <div className="menuDisplayName">{displayName}</div>
        </div>
        <p>{action}</p>
      </li>
    );
  });

  return (
    <ul>{subs}</ul>
  );
}

export default Users;
