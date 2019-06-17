import React from 'react';
import { goFetch, throttling } from './utils.js';
import ResourceContext from './ResourceContext.js';
import SessionContext from './SessionContext.js';
import Auth from './Auth/Auth.js';
import Dashboard from './Dashboard/Dashboard.js';
import Chat from './Chat/Chat.js';
import UserProfile from './UserProfile/UserProfile.js';

class ResourceProvider extends React.Component {
  // static contextType = SessionContext;

  firebase = this.props.firebase;
  onlineUsersRef = this.firebase.database().ref(`users`);
  messagesRef = this.firebase.database().ref(`messages`);

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

  updateResource = options => {
    this.setState(options);
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
      .equalTo(`${activeRoomKey}`)
      .limitToLast(1)
      .on('child_added', snapshot => {
        if (snapshot.val().roomId === activeRoomKey) {
          const message = Object.assign({}, snapshot.val(), { key: snapshot.key });
          this.updateMessages(message);
        }
    });
    this.messagesRef
      .orderByChild('roomId')
      .equalTo(`${activeRoomKey}`)
      .limitToLast(1)
      .on('child_removed', snapshot  => {
        if (snapshot.val().roomId === activeRoomKey) {
          const message = Object.assign({}, snapshot.val(), { key: snapshot.key });
          this.updateMessages(message);
        }
    });
  };

  getRooms = async rooms => {
    console.log(this.props.session);
    const url = `${process.env.REACT_APP_HTTP_URL}/getRooms`;
    const roomIds = rooms ? rooms : [];
    const subscribedRooms = await goFetch(url, {
      body: JSON.stringify({ roomIds })
    });
    return subscribedRooms ? subscribedRooms : {};
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
    const resourceValue = {
      messages: this.state.messages,
      subscribedRooms: this.state.subscribedRooms,
      users: this.state.users
    }
    return (
      <main className='Chat'>
        <ResourceContext.Provider value={resourceValue}>
          {this.props.children}
        </ResourceContext.Provider>
      </main>
    );
  };

}

export default ResourceProvider;
