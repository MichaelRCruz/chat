import React from 'react';
import './Chat.css';
import Messages from '../Messages/Messages.js';
import Menu from '../Menu/Menu.js';
import SubmitMessage from '../SubmitMessage/SubmitMessage.js';
import ResourceContext from '../ResourceContext.js';

class Chat extends React.Component {
  state = {
    // isLoading: true,
    // messageMode: 'notifications'
  }

  static contextType = ResourceContext;
  static defaultProps = {
    user: {},
    users: [],
    subscribedRooms: [],
    activeRoom: {},
    messages: {}
  };

  toggleDashboard = () => {
    this.props.toggleDashboard();
  };

  toggleUserProfile = () => {
    this.props.toggleUserProfile();
  };

  componentDidMount() {
    const { resourcce } = this.props;
    console.log('are we reaching: ', resourcce);
  }

  render() {
    const { users, subscribedRooms=[], activeRoom, messages } = this.context;
    const { user } = this.props;
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
          <Menu user={user} subscribedRooms={subscribedRooms} />
        </aside>
        <main className="main">
          <Messages activeRoom={activeRoom} messages={messages} />
        </main>
        <footer className="footer">
          <SubmitMessage activeRoom={activeRoom} />
        </footer>
      </div>
    );
  }
}

// export default React.forwardRef((props, ref) => (
//   <ResourceContext.Consumer>
//     {resource => <Chat {...props} theme={resource} ref={ref} />}
//   </ResourceContext.Consumer>
// ));

export default Chat;
