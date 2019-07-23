import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

const Traffic = props => {

  // static contextType = SessionContext;

  const { traffic } = props;
  const _traffic = traffic ? traffic : [];
  const actions = _traffic.map((action, i) => {
    const { photoURL, displayName, activity, key } = action;
    console.log(photoURL, displayName, activity, key);
    return (
      <li className="onlineUser" key={key}>
        <div className={"userContainer"}>
          <img
            className="userMenuImage"
            alt="user"
            src={ photoURL || defaultUserImage}
           />
          <div className="menuDisplayName">{displayName}</div>
          <p className="menuDisplayName">{activity}</p>
        </div>
      </li>
    );
  });
  return (
    <ul>{actions}</ul>
  );
}

export default Traffic;
