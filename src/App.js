import React from 'react';
import './App.css';
import Auth from './Auth/Auth';
import Modal from './Modal/Modal';

import Messages from './Messages/Messages';
import RoomList from './RoomList/RoomList';
import SubmitMessage from './SubmitMessage/SubmitMessage';
import Splash from './Splash/Splash';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: null,
      currentFcmToken: null,
      isLoading: true,
      show: false,
      showRooms: true,
      subscribedRooms: null,
      user: null,
      userConfig: null
    }
  };

  componentDidMount() {
    console.log('0.016');
    this.props.firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.handleConnection(user.uid);
        let {userConfig, activeRoom, subscribedRooms} = await this.getUserConfig(user);
        if (this.props.firebase.messaging.isSupported()) {
          const messaging = this.props.firebase.messaging();
          const currentFcmToken = await messaging.getToken();
          this.handleFcmToken(currentFcmToken, user.uid, true)
          userConfig = Object.assign({}, userConfig, { currentFcmToken });
          messaging.onTokenRefresh(function() {
            console.log('refreshed token');
            this.requestNotifPermission(user.uid);
          });
        }
        await this.setState({ user, userConfig, activeRoom, isLoading: false, subscribedRooms });
      } else {
        this.setState({ user, userConfig: null, activeRoom: null, isLoading: false, show: false, showRooms: false, subscribedRooms: null });
      }
    });
  };

  getUserConfig = user => {
    const { uid, displayName } = user;
    return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/createRoomAndUserConfig`, {
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
    // https://firebase.google.com/docs/database/web/read-and-write#detach_listeners
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
  }

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
    return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/addTokenToTopic`, {
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

  setFcmToken = fcmToken => {
    console.log('fcmToken: ', fcmToken);
  };

  setActiveRoom = activeRoom => {
    this.setState({ activeRoom });
  };

  createName = (values) => {
    console.log('email form wired up and validated: ', values);
  };

  toggleModal = () => {
    this.setState({
      show: !this.state.show
    });
  };

  toggleRooms = () => {
    this.setState({
      showRooms: !this.state.showRooms
    });
  };

  render() {
    const {activeRoom, user, userConfig, showRooms, show, isLoading, currentFcmToken, subscribedRooms} = this.state;
    const app = (
      <div className="appComponent">
        <header className="header">
          <div className="menuIconContainer">
            <i className="material-icons menuIcon"
               onClick={this.toggleModal}>sort</i>
          </div>
          <div className="appNameContainer">
            <a href="https://michaelcruz.io/chat">
              <p className="headerAppName">Potato</p>
            </a>
          </div>
          <div className="headerIconContainer">
            <i className="material-icons personIcon"
               onClick={this.toggleModal}>person</i>
          </div>
        </header>
        <aside className={showRooms ? "sidebar" : "displayUnset"}>
          <RoomList
            className="lightContainer"
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            user={user}
            userConfig={userConfig}
            subscribedRooms={subscribedRooms}
            setActiveRoom={this.setActiveRoom.bind(this)}
          />
        </aside>
        <main className={!showRooms ? "main" : "main overflowHidden"}>
          <Messages
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            user={user}
            userConfig={userConfig}
          />
        </main>
        <footer className="footer">
          <SubmitMessage
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            user={user}
            userConfig={userConfig}
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
        toggleModal={this.toggleModal.bind(this)}
        requestNotifPermission={this.requestNotifPermission.bind(this)}
        handleFcmToken={this.handleFcmToken.bind(this)}
      />
    );
    const splash = (
      <Splash toggleModal={this.toggleModal.bind(this)} />
    );
    const modal = (
      <Modal
        show={show}
        children={auth}
        handleClose={this.toggleModal.bind(this)}>
      </Modal>
    );
    const loadingAnimation = (
      <div className="loadingAnimation"></div>
    );
    return (
      <div>
        {user ? app : null}
        {!user && !isLoading ? splash : null}
        {!user && isLoading ? loadingAnimation : null}
        {show ? modal : null}
      </div>
    );
  }
}

export default App;
