import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

class Users extends React.Component {

  static contextType = SessionContext;

  render() {
    const { userConfigs={} } = this.context.state;
    const users = Object.keys(userConfigs);
    // console.log(foo.constructor);
    const subscribers = users.map((usr, i) => {
      return (
        <li className="onlineUser" key={userConfigs[usr].key}>
          <button className="inspectUserButton">
            <div>
              <img
                className="userMenuImage"
                alt="user"
                src={userConfigs[usr].photoURL || defaultUserImage}
               />
              <p className="menuDisplayName">{ userConfigs[usr].displayName }</p>
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
