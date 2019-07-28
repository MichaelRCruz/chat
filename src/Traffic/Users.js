import React, { Fragment, useState, useContext, useEffect } from 'react';
import * as firebase from 'firebase';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import ErrorBoundary from '../ErrorBoundary.js';
import { throttling } from '../utils.js';
// import '../Menu/Menu.css';

const Users = () => {

  const { state } = useContext(SessionContext);
  const { activeRoom } = state;
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const users = activeRoom.users;
    const onliners = Object.assign({}, users);
    const muhSubs = users ? users : {};
    const subscribers = Object.keys(muhSubs);
    let buffer = [];

    const userThrottler = throttling(() => {
      buffer.forEach((user, index) => {
        if (subscribers.includes(user.uid)) onliners[user.uid] = user;
      });
      setSubscribers(Object.values(onliners));
    }, 100);

    const addUserRef = firebase.database().ref(`/USERS_ONLINE`);
    addUserRef
      .on('child_added', snap => {
        const user = snap.val();
        user.action = 'sup';
        buffer.push(user);
        userThrottler();
      });

    const removeUserRef = firebase.database().ref(`/USERS_ONLINE`);
    removeUserRef
      .on('child_removed', async snap => {
        const user = snap.val();
        user.action = 'brb';
        buffer.push(user);
        userThrottler();
      });
    return () => {
      addUserRef.off();
      removeUserRef.off();
    }
  }, [activeRoom]);

  const subs = subscribers.map((user, i) => {
    const { photoURL, displayName, action, uid } = user;
    return (
      <li className="userListItem" key={uid}>
        <ErrorBoundary>
          <div className="userListContent">
            <img
              className="userImage"
              alt="user"
              src={ photoURL || defaultUserImage}
             />
            <div className="userDisplayName">
              <p>{displayName}</p>
            </div>
            <div className="userUserAction">
              <p>{action || 'offline'}</p>
            </div>
          </div>
        </ErrorBoundary>
      </li>
    );
  });

  return !subscribers.length
    ? <div className="widgetLoader"></div>
    : (
      <ul className="usersList">{subs}</ul>
    );
}

export default Users;
