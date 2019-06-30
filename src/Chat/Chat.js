import React from 'react';
import { Link } from 'react-router-dom';
import './Chat.css';
import Messages from '../Messages/Messages.js';
import Menu from '../Menu/Menu.js';
import SubmitMessage from '../SubmitMessage/SubmitMessage.js';
// import SessionContext from '../SessionContext.js';

class Chat extends React.Component {
  componentDidMount() {
    // const urlRoom = this.props.match.params.roomid;
    // const currrentRoom = this.context.state.activeRoom.key;
    // if (currrentRoom != urlRoom) {
    //   this.props.history.push(`/chat/rooms/${urlRoom}`);
    //   this.context.updateActiveRoom(urlRoom);
    // }
    // console.log(this.props.match.params.roomid);
  }
  // static contextType = SessionContext;
  render() {
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

export default Chat;
