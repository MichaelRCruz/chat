 import React from 'react';
import './Chat.css';
import Messages from '../Messages/Messages.js';
import Menu from '../Menu/Menu.js';
import SubmitMessage from '../SubmitMessage/SubmitMessage.js';
import SessionContext from '../SessionContext.js';
import ResourceContext from '../ResourceContext.js';

class Chat extends React.Component {
  state = {
    isLoading: true
    // messageMode: 'notifications'
  }

  static contextType = SessionContext;

  toggleDashboard = () => {
    this.props.toggleDashboard();
  };

  toggleUserProfile = () => {
    this.props.toggleUserProfile();
  };

  render() {
    const { user, activeRoom } = this.context || {};
    const { subscribedRooms=[], messages={} } = this.props.resource;
    // console.log(this.context);
    // console.log(this.props);
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

      </div>
    )
  }
}

// export default Chat;

export default React.forwardRef((props, ref) => (
  <ResourceContext.Consumer>
    {resource => <Chat {...props} resource={resource} ref={ref} />}
  </ResourceContext.Consumer>
));
