import React from 'react';
import Chat from '../Chat/Chat.js';
import UserProfile from '../UserProfile/UserProfile.js';
import Dashboard from '../Dashboard/Dashboard.js';
// import SessionContext from '../SessionContext.js';
// import ResourceProvider from '../ResourceProvider.js';
import './Layout.css';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showDashboard: false,
      showProfile: false
    }
  };

  componentDidMount() {

  }

  render() {
    const { isLoading, showProfile, showDashboard } = this.state;
    // console.log(this.props);
    return (
        <main>
          {isLoading ? <div className="loadingAnimation"></div> : null}
          {showProfile ? <UserProfile /> : null}
          {showDashboard ? <Dashboard /> : null}
          {!isLoading ? <Chat /> : null}
        </main>
    );
  }
}

export default Layout;
