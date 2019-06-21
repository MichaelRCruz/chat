import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

class Users extends React.Component {


  static contextType = SessionContext;
  render() {
    const { users } = this.context.state;
    const onlineUsers = users.map((usr, i) => {
      return (
        <li className="onlineUser" key={usr.uid}>
          <button className="inspectUserButton">
            <div>
              <img
                className="userMenuImage"
                alt="user"
                src={usr.photoURL || defaultUserImage}
               />
              <p className="menuDisplayName">{ usr.displayName }</p>
            </div>
          </button>
        </li>
      );
    });
    return (
      <section className="onlineUsersComponent">
        <ul>
          {onlineUsers}
        </ul>
      </section>
    );
  };
}

export default Users;
