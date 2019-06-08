import React from 'react';
import {throttling} from '../utils.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

class Users extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      onlineUsers: []
    }
    this.subscribedUsersRef = this.props.firebase.database().ref('users');
  };

  componentDidMount() {
    this.setOnlineUsers();
    this.subscribedUsersRef.on('child_changed', snapshot  => {
      this.setOnlineUsers();
    });
  };

  setOnlineUsers() {
    const users = [];
    const userThrottler = throttling(() => {
      this.setState({onlineUsers: users.slice(0)});
    }, 100);
    this.subscribedUsersRef.on('child_added', snapshot => {
      const user = Object.assign(snapshot.val(), {key: snapshot.key});
      if (user.activity.isOnline) {
        users.push(user);
      }
      userThrottler();
    });
  };

  inspectUser = (key, index) => {
    console.log(key, index);
  };

  render() {
    const onlineUsers = this.state.onlineUsers.map((user, index) => {
      return (
        <li className="onlineUser" key={index}>
          <button className="inspectUserButton" onClick={() => this.inspectUser(user.key, index)}>
            <div>
              <img
                className="userMenuImage"
                alt="user"
                src={defaultUserImage}
               />
              <p className="menuDisplayName">{ user.displayName }</p>
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
