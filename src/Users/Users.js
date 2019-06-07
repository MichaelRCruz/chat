import React from 'react';
import {throttling} from '../utils.js';

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

  render() {
    const onlineUsers = this.state.onlineUsers.map((user, index) => {
      return (
        <li key={index}>
          <h1>{user.displayName}</h1>
        </li>
      );
    });
    return (
      <ul>
        {onlineUsers}
      </ul>
    );
  };
}

export default Users;
