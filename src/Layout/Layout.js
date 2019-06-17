import React from 'react';
import './Layout.css';
import { goFetch, throttling } from '../utils.js';
import SessionContext from '../SessionContext.js';
import ResourceContext from '../ResourceContext.js';

import Auth from '../Auth/Auth.js';
import Dashboard from '../Dashboard/Dashboard.js';
import Chat from '../Chat/Chat.js';
import UserProfile from '../UserProfile/UserProfile.js';

class Layout extends React.Component {

  static contextType = SessionContext;

  firebase = this.props.firebase;
  onlineUsersRef = this.firebase.database().ref(`users`);
  messagesRef = this.props.firebase.database().ref(`messages`);

  toggleUserProfileModal = () => {
    this.setState({
      showProfile: !this.state.showProfile
    });
  };

  toggleDashboardModal = () => {
    this.setState({
      showDashboard: !this.state.showDashboard
    });
  };

  state = {
    isLoading: false,
    showDashboard: false,
    showProfile: false,
    messages: {},
    subscribedRooms: [],
    users: []
  };

  updateActiveRoom = activeRoom => {
    this.setState({ activeRoom }, () => {
      this.setMessagesListeners(activeRoom.key);
    });
  };

  updateMessages = messages => {
    this.setState({
      messages: this.state.messages.concat(messages)
    });
  };

  setListeners(activeRoomKey) {
      const onlineUsers = [];
      const userThrottler = throttling(() => {
        this.setState({ onlineUsers: onlineUsers.slice(0) });
      }, 100);
      this.onlineUsersRef
        .on('child_added', snapshot => {
        const onlineUser = Object.assign(snapshot.val(), {key: snapshot.key});
        if (onlineUser.activity.isOnline) {
          onlineUsers.push(onlineUser);
        }
        userThrottler();
      });
      this.messagesRef
        .orderByChild('roomId')
        .equalTo(activeRoomKey)
        .limitToLast(1)
        .on('child_added', snapshot => {
          if (snapshot.val().roomId === activeRoomKey) {
            this.updateMessages(snapshot.val());
          }
      });
      this.messagesRef
        .orderByChild('roomId')
        .equalTo(activeRoomKey)
        .limitToLast(1)
        .on('child_removed', snapshot  => {
          if (snapshot.val().roomId === this.state.activeRoom.key) {
            this.updateMessages(snapshot.val());
          }
      });
  };

  getRooms = async rooms => {
    const url = `${process.env.REACT_APP_HTTP_URL}/getRooms`;
    const roomIds = rooms ? rooms : [];
    const subscribedRooms = await goFetch(url, {
      body: JSON.stringify({ roomIds })
    });
    const activeRoom =  subscribedRooms ? subscribedRooms[0] : {};
    this.setState({ subscribedRooms, subscribedRoomIds: roomIds });
  };

  getMessages = (roomId, messageCount) => {
    return fetch(`${process.env.REACT_APP_HTTP_URL}/getMessages`, {
      method: 'POST',
      body: JSON.stringify({ roomId, messageCount })
    })
    .then(res => {
      return res.json();
    }).catch(error => {
      console.log(error);
    });
  };

  render() {
    const { isLoading, showProfile, showDashboard } = this.state;
    const sessionProps = this.props.session;

    const resourceValue = {
      messages: this.state.messages,
      subscribedRooms: this.state.subscribedRooms,
      users: this.state.users,
    }

    return (
      <main className='Layout'>
        <ResourceContext.Provider value={resourceValue}>
          {isLoading ? <div className="loadingAnimation"></div> : null}
          {showProfile ? <UserProfile {...sessionProps} /> : null}
          {showDashboard ? <Dashboard {...sessionProps} /> : null}
          {!isLoading ? <Chat {...sessionProps} /> : null}
        </ResourceContext.Provider>
      </main>
    );

  };

}

// export default Layout;

export default React.forwardRef((props, ref) => (
  <SessionContext.Consumer>
    {session => <Layout {...props} session={session} ref={ref} />}
  </SessionContext.Consumer>
));
