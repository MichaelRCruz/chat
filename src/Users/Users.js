import React from 'react';
import * as firebase from 'firebase';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import {throttling} from '../utils.js';
import './Users.css';

class Users extends React.Component {

  state = {
    subs: []
  }

  componentDidMount() {
    const users = this.props.activeRoom.users;
    const muhSubs = users ? users : {};
    const subscribers = Object.keys(muhSubs);
    let activeUsers = [];
    let onliners = Object.assign({}, users);

    const userThrottler = throttling(async () => {
      activeUsers.forEach((user, index) => {
        onliners[user.uid] = user;
      });
      this.setState({ subs: Object.values(onliners) }, () => {
        activeUsers = [];
      });
    }, 100);

    const activeUsersRef = firebase.database().ref(`/USERS_ONLINE`);
    activeUsersRef
      .on('child_added', snap => {
        const user = snap.val();
        console.log(user.subs);
        const subs = user.subs;
        user.action = 'sup';
        activeUsers.push(user);
        userThrottler();
      });

    activeUsersRef
      .on('child_removed', async snap => {
        const user = snap.val();
        console.log(user.subs);
        const subs = user.subs;
        user.action = 'brb';
        activeUsers.push(user);
        userThrottler();
      });
  }

  render() {
    // const { activeSubs } = this.props;
    const { subs } = this.state;
    const _subs = subs ? subs : [];

    const subscribers = _subs.map((user, i) => {
      const { photoURL, displayName, action, uid } = user;
      return (
        <li className="onlineUser" key={uid}>
          <div className={"userContainer"}>
            <img
              className="userMenuImage"
              alt="user"
              src={ photoURL || defaultUserImage}
             />
            <div className="menuDisplayName">{displayName}</div>
          </div>
          <p>{action}</p>
        </li>
      );
    });

    return (
      <ul>{subscribers}</ul>
    );
  }

}

export default Users;
