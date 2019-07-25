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
  const { users } = this.context.state.activeRoom;

  static contextType = SessionContext;
  componentDidMount() {
    // const { users } = this.context.state.activeRoom;
    console.log(users);
    const muhSubs = users ? users : {};
    const subscribers = Object.keys(muhSubs);
    let buffer = [];
    let onliners = Object.assign({}, users);

    const userThrottler = throttling(() => {
      buffer.forEach((user, index) => {
        onliners[user.uid] = user;
      });
      this.setState({ subs: Object.values(onliners) }, () => {
        buffer = [];
      });
    }, 100);

    const addedRef = firebase.database().ref(`/USERS_ONLINE`);
    addedRef
      .on('child_added', snap => {
        const user = snap.val();
        user.action = 'sup';
        buffer.push(user);
        userThrottler();
      });

    const removedRef = firebase.database().ref(`/USERS_ONLINE`);
    removedRef
      .on('child_removed', async snap => {
        const user = snap.val();
        user.action = 'brb';
        buffer.push(user);
        userThrottler();
      });

    // const activeUsersRef = firebase.database().ref(`/users`);
    // usersRef
    //   .once('value', snap => {
    //     let subbies = [];
    //     snap.forEach(user => {
    //       const key = user.key;
    //       const sub = user.val();
    //
    //       userThrottler();
    //     });
    //   });
  }

  // const { activeRoom } = this.context.state;
  render() {
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
