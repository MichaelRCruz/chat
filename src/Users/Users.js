import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

class Users extends React.Component {

  static contextType = SessionContext;

  render() {
    const { userConfigs={}, liveUser={} } = this.context.state;
    console.log(liveUser);
    const users = Object.entries(userConfigs);
    const subscribers = users.map((usr, i) => {
      const { photoURL, displayName, activity } = usr[1];
      return (
        <li className="onlineUser" key={usr[0]}>
          <button className="inspectUserButton">
            <div>
              <img
                className="userMenuImage"
                alt="user"
                src={photoURL || defaultUserImage}
               />
              <p className="menuDisplayName">{displayName}</p>
            </div>
          </button>
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
