import React from 'react';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

class Users extends React.Component {

  handleClick = user => {
    console.log(user);
  }


  static contextType = SessionContext;
  render() {
    const { users } = this.context.state;
    const uids = Object.keys(users);
    const onlineUsers = uids.map((uid, i) => {
      return (
        <li className="onlineUser" key={i}>
          <button className="inspectUserButton" onClick={() => this.handleClick(users[uid])}>
            <div>
              <img
                className="userMenuImage"
                alt="user"
                src={users[uid].photoURL || defaultUserImage}
               />
              <p className="menuDisplayName">{ users[uid].displayName }</p>
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
