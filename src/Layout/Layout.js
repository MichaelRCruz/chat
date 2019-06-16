import React from 'react';
import './Layout.css';
import { goFetch } from '../utils.js';
import SessionContext from '../SessionContext.js';
import ResourceContext from '../ResourceContext.js';

import Auth from '../Auth/Auth.js';
import Dashboard from '../Dashboard/Dashboard.js';
import Chat from '../Chat/Chat.js';
import UserProfile from '../UserProfile/UserProfile.js';

class Layout extends React.Component {

  static contextType = SessionContext;
  static defaultProps = {
    subscribedRooms: [],
    activeRoom: {}
  };

  state = {
    isLoading: true,
    showProfile: false,
    showDashboard: false,
    subscribedRooms: [],
    createRoom: () => {},
    updateActiveRoom: this.updateActiveRoom,
    destroyRoom: () => {}
  };

  updateActiveRoom = activeRoom => {
    this.setState({ activeRoom });
  };

  getAndSetSubscribedRooms = async roomIds => {
    const url = `${process.env.REACT_APP_HTTP_URL}/getRooms`;
    const subscribedRooms = await goFetch(url, {
      body: JSON.parse({ roomIds })
    });
    const activeRoom =  subscribedRooms ? subscribedRooms[0] : {};
    this.setSubscribedRooms(subscribedRooms, activeRoom);
  };

  setSubscribedRooms = (subscribedRooms, activeRoom) => {
    this.setState({ subscribedRooms, activeRoom });
  };

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

  async componentDidMount() {
    const { userConfig, user } = this.context;
    const subscribedRoomIds = userConfig.rooms;
    const response = await this.getAndSetSubscribedRooms(subscribedRoomIds);
  }

  render() {
    const { isLoading, showProfile, showDashboard } = this.state;
    const { user, userConfig } = this.context;

    const sessionValue = {
      messages: this.state.messages,
      subscribedRooms: this.state.subscribedRooms,
      users: this.state.users,
      createMessage: this.state.createMessage,
      updateMessage: this.state.updateMessage,
      destroyMessage: this.state.destroyMessage,
      createRoom: this.state.createRoom,
      updateRoom: this.state.updateRoom,
      destroyRoom: this.state.destroyRoom,
      updateUser: this.state.updateUser,
      destrotyUser: this.state.destroyUser
    }
    return (
      <main className='Layout'>
        <ResourceContext.Provider value={sessionValue}>
          {isLoading ? <div className="loadingAnimation"></div> : null}
          {showProfile ? <UserProfile userConfig={userConfig} user={user} /> : null}
          {showDashboard ? <Dashboard userConfig={userConfig} user={user} /> : null}
          {user ? <Chat userConfig={userConfig} user={user}  /> : null}
        </ResourceContext.Provider>
      </main>
    );

  };

}

export default Layout;
