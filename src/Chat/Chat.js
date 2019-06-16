import React from 'react';
import './Chat.css';
import Messages from '../Messages/Messages.js';
import Menu from '../Menu/Menu.js';
import SubmitMessage from '../SubmitMessage/SubmitMessage.js';

class Layout extends React.Component {
  state = {
    // isLoading: true,
    // messageMode: 'notifications'
  }

  toggleDashboard = () => {
    this.props.toggleDashboard();
  };

  toggleUserProfile = () => {
    this.props.toggleUserProfile();
  };

  render() {
    // const { users, rooms, messages } = this.context;
    return (
      <div className="appComponent">
        <header className="header">
          <div className="menuIconContainer">
            <i className="material-icons menuIcon"
               onClick={this.toggleDashboard}>sort</i>
          </div>
          <div className="appNameContainer">
            <a href="https://michaelcruz.io/chat">
              <p className="headerAppName">Potato</p>
            </a>
          </div>
          <div className="headerIconContainer">
            <i className="material-icons personIcon"
               onClick={this.toggleUserProfile}>person</i>
          </div>
        </header>
        <aside className="sidebar">
          <Menu />
        </aside>
        <main className="main">
          <Messages />
        </main>
        <footer className="footer">
          <SubmitMessage />
        </footer>
      </div>
    );
  }
}

export default Layout;
