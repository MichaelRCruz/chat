import React from 'react';
import './App.css';

import Auth from './Auth/Auth';
import Dashboard from './Dashboard/Dashboard';
import Modal from './Modal/Modal';
import Messages from './Messages/Messages';
import Menu from './Menu/Menu';
import SubmitMessage from './SubmitMessage/SubmitMessage';
import Splash from './Splash/Splash';
import Waiting from './Waiting/Waiting.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: null,
      currentFcmToken: null,
      inWaiting: false,
      isLoading: true,
      showAuthModal: false,
      messageMode: 'notifications',
      showDashboardModal: false,
      subscribedRooms: null,
      user: null,
      userConfig: null
    }
    this.baseState = this.state;
  };

  componentDidMount() {
    const { user, firebase, credential, displayName, email, error, isNew } = this.props;
    firebase.auth().onAuthStateChanged(currentUser => {
      if (!currentUser) {
        this.setState(Object.assign({}, this.baseState, { isLoading: false }));
      } else {
        if (isNew) {
          console.log('isNew', {user, firebase, credential, displayName, email, error, isNew});
          this.setState({ isLoading: false, inWaiting: true, showAuthModal: false, user });
        } else if (credential) {
          this.setState({ isLoading: false, user, credential });
          console.log('credential', {user, firebase, credential, displayName, email, error, isNew});
        } else {
          console.log('default', {user, firebase, credential, displayName, email, error, isNew});
          this.setState(Object.assign({}, this.baseState, { isLoading: false }));
          firebase.auth().signOut();
        }
      }
    });
  };

  loadApp = async (firebase, currentUser, displayName, email) => {
    this.handleConnection(currentUser.uid);
    let {userConfig, activeRoom, subscribedRooms} = await this.getUserConfig(currentUser);
    if (firebase.messaging.isSupported()) {
      const messaging = firebase.messaging();
      const currentFcmToken = await messaging.getToken();
      this.handleFcmToken(currentFcmToken, currentUser.uid, true)
      userConfig = Object.assign({}, userConfig, { currentFcmToken });
      messaging.onTokenRefresh(function() {
        console.log('refreshed token');
        this.requestNotifPermission(currentUser.uid);
      });
    }
    this.setState({ user: currentUser, userConfig, activeRoom, isLoading: false, subscribedRooms, messageMode: 'notifications' });
  }

  renderWaitingRoom = () => {
    this.setState({ inWaiting: !this.state.inWaiting });
  }

  getUserConfig = user => {
    const { uid, displayName } = user;
    return fetch(`${process.env.REACT_APP_HTTP_URL}/createRoomAndUserConfig`, {
      method: 'POST',
      body: JSON.stringify({ uid, displayName })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
  };

  handleConnection = uid => {
    const userStatusDatabaseRef = this.props.firebase.database().ref(`users/${uid}/activity`);
    const isOfflineForDatabase = {
      isOnline: false,
      lastChanged: this.props.firebase.database.ServerValue.TIMESTAMP,
    };
    const isOnlineForDatabase = {
      isOnline: true,
      lastChanged: this.props.firebase.database.ServerValue.TIMESTAMP,
    };
    this.props.firebase.database().ref('.info/connected').on('value', function(snapshot) {
      if (snapshot.val() === false) {
        return;
      };
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    });
  };

  requestNotifPermission = uid => {
    let _self = this;
    return this.messaging.requestPermission()
    .then(function() {
      return _self.messaging.getToken();
    })
    .then(token => {
      console.log(token);
      return this.handleFcmToken(token, uid, true)
      .then(fcmToken => {
        return token;
      });
    })
    .catch(function(err) {
      console.log('error occured from requestNotifPermission()', err);
      return null;
    });
  };

  handleFcmToken = (fcmToken, uid, subscription) => {
    return fetch(`${process.env.REACT_APP_HTTP_URL}/addTokenToTopic`, {
      method: 'POST',
      body: JSON.stringify({ fcmToken, uid, subscription})
    })
    .then(function(response) {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
  };

  setActiveRoom = activeRoom => {
    console.log(activeRoom.key)
    this.setState({ activeRoom, showDashboardModal: false });
  };

  toggleAuthModal = () => {
    this.setState({
      showAuthModal: !this.state.showAuthModal
    });
  };

  toggleDashboardModal = () => {
    this.setState({
      showDashboardModal: !this.state.showDashboardModal
    });
  };

  toggleMessageMode = messageMode => {
    switch (messageMode) {
      case 'messages':
        messageMode = 'notifications';
        break;
      case 'notifications':
        messageMode = 'messages';
        break;
    }
    this.setState({ messageMode });
  };

  render() {
    const {activeRoom, user, userConfig, showDashboardModal, showAuthModal, isLoading, currentFcmToken, subscribedRooms, messageMode, notifications, inWaiting } = this.state;
    const app = (
      <div className="appComponent">
        <header className="header">
          <div className="menuIconContainer">
            <i className="material-icons menuIcon"
               onClick={this.toggleDashboardModal}>sort</i>
          </div>
          <div className="appNameContainer">
            <a href="https://michaelcruz.io/chat">
              <p className="headerAppName">Potato</p>
            </a>
          </div>
          <div className="headerIconContainer">
            <i className="material-icons personIcon"
               onClick={this.toggleAuthModal}>person</i>
          </div>
        </header>
        <aside className="sidebar">
          <Menu
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            user={user}
            userConfig={userConfig}
            subscribedRooms={subscribedRooms}
            setActiveRoom={this.setActiveRoom.bind(this)}
          />
        </aside>
        <main className="main">
          <Messages
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            user={user}
            userConfig={userConfig}
            messageMode={messageMode}
            openModals={showAuthModal || showDashboardModal}
          />
        </main>
        <footer className="footer">
          <SubmitMessage
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            user={user}
            userConfig={userConfig}
            messageMode={messageMode}
            toggleMessageMode={this.toggleMessageMode.bind(this)}
          />
        </footer>
      </div>
    );
    const auth = (
      <Auth
        firebase={this.props.firebase}
        userConfig={userConfig}
        user={user}
        currentFcmToken={currentFcmToken}
        toggleModal={this.toggleAuthModal.bind(this)}
        requestNotifPermission={this.requestNotifPermission.bind(this)}
        handleFcmToken={this.handleFcmToken.bind(this)}
        renderWaitingRoom={this.renderWaitingRoom.bind(this)}
      />
    );
    const dashboard = (
      <Dashboard
        firebase={this.props.firebase}
        subscribedRooms={subscribedRooms}
        setActiveRoom={this.setActiveRoom.bind(this)}
      />
    );
    const splash = (
      <Splash toggleModal={this.toggleAuthModal.bind(this)} />
    );
    const authModal = (
      <Modal
        title="settings"
        show={showAuthModal}
        children={auth}
        handleClose={this.toggleAuthModal.bind(this)}>
      </Modal>
    );
    const dashboardModal = (
      <Modal
        title="dashboard"
        show={showDashboardModal}
        children={dashboard}
        handleClose={this.toggleDashboardModal.bind(this)}>
      </Modal>
    );
    const loadingAnimation = (
      <div className="loadingAnimation"></div>
    );
    const waitingModal = (
      <Waiting />
    );
    return (
      <div>
        {user && !showAuthModal && !inWaiting && !showDashboardModal ? app : null}
        {!user && !isLoading && !inWaiting ? splash : null}
        {!user && isLoading ? loadingAnimation : null}
        {!user && inWaiting ? waitingModal : null}
        {showAuthModal && !inWaiting ? authModal : null}
        {showDashboardModal && !inWaiting ? dashboardModal : null}
      </div>
    );
  }
}

export default App;
