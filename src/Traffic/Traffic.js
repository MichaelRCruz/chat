import React, { useState, useContext, useEffect } from 'react';
import * as firebase from 'firebase';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import { throttling } from '../utils.js';
import './Users.css';

const Traffic = props => {

  const { state } = useContext(SessionContext);
  const { activeRoom } = state;
  const [actions, setActions] = useState([]);

  useEffect(() => {
    let traffic = [];
    const trafficThrottler = throttling(async () => {
      const sortedActions = await traffic.sort((a, b) => {
        return b.lastChamged - a.lastChanged;
      });
      const slicedActions = await sortedActions.slice(Math.max(sortedActions.length - 5, 0))
      await setActions(slicedActions.reverse());
    }, 100);

    const addedRef = firebase.database().ref(`/TRAFFIC`);
    addedRef
      .on('child_added', snap => {
        const user = snap.val();
        if (user.action === 'ONLINE') user.action = 'sup';
        if (user.action === 'OFFLINE') user.action = 'brb';
        traffic.push(user);
        trafficThrottler();
      });
    return () => {
      addedRef.off();
      setActions([]);
    }
  }, []);

  const actionsList = actions.map((user, i) => {
    const { photoURL, displayName, action, uid } = user;
    return (
      <li key={i}>
        <div className="userContainer">
          <img
            className="userImage"
            alt="user"
            src={ photoURL || defaultUserImage}
           />
          <div className="displayName">
            <p>{displayName}</p>
          </div>
          <div className="userAction">
            <p>{action || 'offline'}</p>
          </div>
        </div>
      </li>
    );
  });
  return !actions.length
    ? <div className="widgetLoader"></div>
    : (
      <section className="usersComponent">
        <ul>{actionsList}</ul>
      </section>
    );
}

export default Traffic;
