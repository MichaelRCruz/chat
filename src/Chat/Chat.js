import React from 'react';
import './Chat.css';
import SessionContext from '../SessionContext.js';

import Auth from '../Auth/Auth.js';
import Dashboard from '../Dashboard/Dashboard.js';
import Modal from '../Modal/Modal.js';
import Messages from '../Messages/Messages.js';
import Menu from '../Menu/Menu.js';
import SubmitMessage from '../SubmitMessage/SubmitMessage.js';
import Splash from '../Splash/Splash.js';

class Chat extends React.Component {
  static contextType = SessionContext;
  static defaultProps = {
    session: {
      user: {}
    }
  }
  state = {
    activeRoom: null,
    currentFcmToken: null,
    isLoading: true,
    showAuthModal: false,
    messageMode: 'notifications',
    showDashboardModal: false,
    subscribedRooms: null,
    userConfig: null
  }
  baseState = this.state;

  renderWaitingRoom = () => {
    this.setState({ inWaiting: !this.state.inWaiting });
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
    const { user, isNew, inWaitng } = this.context;
    const {
      activeRoom, userConfig, showDashboardModal, showAuthModal,
      isLoading, currentFcmToken, subscribedRooms, messageMode, notifications
    } = this.state;
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
            user={user}
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            userConfig={userConfig}
            subscribedRooms={subscribedRooms}
            setActiveRoom={this.setActiveRoom.bind(this)}
          />
        </aside>
        <main className="main">
          <Messages
            user={user}
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            userConfig={userConfig}
            messageMode={messageMode}
            openModals={showAuthModal || showDashboardModal}
          />
        </main>
        <footer className="footer">
          <SubmitMessage
            user={user}
            firebase={this.props.firebase}
            activeRoom={activeRoom}
            userConfig={userConfig}
            messageMode={messageMode}
            toggleMessageMode={this.toggleMessageMode.bind(this)}
          />
        </footer>
      </div>
    );
    const auth = (
      <Auth
        user={user}
        firebase={this.props.firebase}
        userConfig={userConfig}
        currentFcmToken={currentFcmToken}
        toggleModal={this.toggleAuthModal.bind(this)}
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
    return (
      <div>
        {isLoading ? loadingAnimation : null}
        {showAuthModal ? authModal : null}
        {showDashboardModal ? dashboardModal : null}

      </div>
    );
  }
}

export default Chat;
