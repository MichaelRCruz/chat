import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

const Users = props => {

  const { activeSubs } = props;
  const subs = activeSubs ? activeSubs : [];

  const subscribers = subs.map((user, i) => {
    const { photoURL, displayName, action, uid } = user;
    console.log(uid);
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
    <ul>{subscribers}</ul>
  );

}

export default Users;
