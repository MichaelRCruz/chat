import React from 'react';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import './Users.css';

class Users extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      onlineUsers: []
    }
    // this.subscribedUsersRef = this.props.firebase.database().ref('users');
  };

  // componentDidMount() {
  //   this.setOnlineUsers();
  //   this.subscribedUsersRef.on('child_changed', snapshot  => {
  //     this.setOnlineUsers();
  //   });
  // };

  // setOnlineUsers() {
  //   const users = [];
  //   const userThrottler = throttling(() => {
  //     this.setState({onlineUsers: users.slice(0)});
  //   }, 100);
  //   this.subscribedUsersRef.on('child_added', snapshot => {
  //     const user = Object.assign(snapshot.val(), {key: snapshot.key});
  //     if (user.activity.isOnline) {
  //       users.push(user);
  //     }
  //     userThrottler();
  //   });
  // };

  render() {
    const users = this.context.users ? this.context.users : [];
    const onlineUsers = users.map((user, index) => {
      return (
        <li className="onlineUser" key={index}>
          <button className="inspectUserButton">
            <div>
              <img
                className="userMenuImage"
                alt="user"
                src={user.photoURL || defaultUserImage}
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
