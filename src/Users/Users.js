import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

class Users extends React.Component {

  static contextType = SessionContext;

  render() {
    const { userConfigs={}, activeUsers={} } = this.context.state;
    // console.log(activeUsers.actives);
    // console.log(userConfigs);
    // const entries = activeUsers ? activeUsers.actives : {};
    const muhUsers = Object.entries(userConfigs);
    const subscribers = muhUsers.map((usr, i) => {
      const { photoURL, displayName, activity } = userConfigs[usr[0]];
      const isOnline = activity.isOnline;
      console.log(usr[1]);
      return (
        <li className="onlineUser" key={usr[0]}>
          <div className={"userContainer"}>
            <button className="inspectUserButton">
              <div className="innderButton">
                <img
                  className="userMenuImage"
                  alt="user"
                  src={photoURL || defaultUserImage}
                 />
                <p className="menuDisplayName">{displayName}</p>
              </div>
            </button>
          </div>
          <div className={isOnline ? "indicator isGreen" : "indicator" }></div>
        </li>
      );
    });
    return (
      <section className="onlineUsersComponent">
        <ul>
          {subscribers}
        </ul>
      </section>
    );
  };
}

export default Users;
