import React from 'react';
import Chat from '../Chat/Chat.js';
import UserProfile from '../UserProfile/UserProfile.js';
import Dashboard from '../Dashboard/Dashboard.js';
import SessionContext from '../SessionContext.js';
import './Layout.css';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showDashboard: false,
      showProfile: false
    }
  };

  componentDidMount() {
    this.setState({ isLoading: !this.state.isLoading });
  }

  render() {
    const { isLoading, showProfile, showDashboard } = this.state;
    return (
      <main>
      <SessionContext.Consumer>
          {(context) => (
            <React.Fragment>
        {isLoading ? <div className="loadingAnimation"></div> : null}
        {showProfile ? <UserProfile /> : null}
        {showDashboard ? <Dashboard /> : null}
        {!isLoading ? <Chat /> : null}

        </React.Fragment>
        )}
  </SessionContext.Consumer>
      </main>
    );
  }
}

export default Layout;
