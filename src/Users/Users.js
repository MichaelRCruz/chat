import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

class Users extends React.Component {

  static contextType = SessionContext;

  render() {
    const { userConfigs={}, activeUsers={} } = this.context.state;
    const users = Object.entries(userConfigs);
    console.log(activeUsers);
    const subscribers = users.map((usr, i) => {
      return (
        <li className="onlineUser" key={usr[0]}>
          <button className="inspectUserButton">
            <div>
              <img
                className="userMenuImage"
                alt="user"
                src={usr[1].photoURL || defaultUserImage}
               />
              <p className="menuDisplayName">{ usr[1].displayName }</p>
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
