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
  // static defaultProps = {
    // session: {}
  // }
  state = {
    isLoading: true,
    messageMode: 'notifications'
  }
  baseState = this.state;

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

  componentDidMount() {
    this.setState({ isLoading: false,  });
  }

  render() {
    const { user, isNew, inWaitng, userConfig, subscribedRooms, activeRoom } = this.context;
    const { showDashboardModal, showAuthModal, isLoading, messageMode } = this.state;
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
    const authModal = (
      <Modal
        title="settings"
        show={showAuthModal}
        handleClose={this.toggleAuthModal.bind(this)}>
        <Auth
          user={user}
          firebase={this.props.firebase}
          userConfig={userConfig}
          toggleModal={this.toggleAuthModal.bind(this)}
        />
      </Modal>
    );
    const dashboardModal = (
      <Modal
        title="dashboard"
        show={showDashboardModal}
        handleClose={this.toggleDashboardModal.bind(this)}>
        <Dashboard
          firebase={this.props.firebase}
          subscribedRooms={subscribedRooms}
        />
      </Modal>
    );
    return (
      <div>
        {isLoading ? <div className="loadingAnimation"></div> : null}
        {showAuthModal ? authModal : null}
        {showDashboardModal ? dashboardModal : null}
        {user ? app : null}
      </div>
    );
  }
}

export default Chat;
