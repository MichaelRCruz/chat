import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

const Traffic = props => {

  // static contextType = SessionContext;

  const { traffic } = props;
  const _traffic = traffic ? traffic : [];
  const actions = _traffic.map((user, i) => {
    const { photoURL, displayName, action, key } = user;
    return (
      <li className="onlineUser" key={i}>
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
    <ul>{actions}</ul>
  );
}

export default Traffic;
