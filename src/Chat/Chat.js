import React from 'react';
import './Chat.css';
import Messages from '../Messages/Messages.js';
import Menu from '../Menu/Menu.js';
import SubmitMessage from '../SubmitMessage/SubmitMessage.js';

class Chat extends React.Component {
  render() {
    return (
      <div className="appComponent">
        <header className="header">
          <div className="menuIconContainer">
            <i className="material-icons menuIcon"
               onClick={null}>sort</i>
          </div>
          <div className="appNameContainer">
            <a href="https://michaelcruz.io/chat">
              <p className="headerAppName">Potato</p>
            </a>
          </div>
          <div className="headerIconContainer">
            <i className="material-icons personIcon">
              person
            </i>
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
    )
  }
}

export default Chat;
