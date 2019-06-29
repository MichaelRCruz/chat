import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Chat.css';
import Messages from '../Messages/Messages.js';
import Menu from '../Menu/Menu.js';
import SubmitMessage from '../SubmitMessage/SubmitMessage.js';
import SessionContext from '../SessionContext.js';

class Chat extends React.Component {
  static contextType = SessionContext;
  render() {
    const { roomid } = this.props.match.params;
    const { handleRoomDeclaration } = this.context;
    handleRoomDeclaration(roomid);
    console.log(roomid);
    return (
      <div className="appComponent">
        <header className="header">
          <div className="menuIconContainer">
            <Link to={`/chat/dashboard`}>
              <i className="material-icons menuIcon" onClick={null}>sort</i>
            </Link>
          </div>
          <div className="appNameContainer">
            <Link to="/chat/rooms">
              <p className="headerAppName">Potato</p>
            </Link>
          </div>
          <div className="headerIconContainer">
            <Link to={'/chat/userProfile'}>
              <i className="material-icons personIcon">person</i>
            </Link>
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

export default withRouter(Chat);
