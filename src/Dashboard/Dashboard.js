import React, { useContext } from 'react';
import Rooms from '../Rooms/Rooms.js';
import Users from '../Traffic/Users.js';
import Traffic from '../Traffic/Traffic.js';
import Modal from '../Modal/Modal.js';
import SessionContext from '../SessionContext.js';
// import './Dashboard.css';

const Dashboard = props => {

  const { history, isSignedOut } = props;

  // const oAuth = useOAuth(false);
  const sessionContext = useContext(SessionContext);
  const { userConfig } = sessionContext.state;

  return (
    <Modal show={true}>
      <section className="dashboardComponent">
        <nav className="nameNav">
          <h1>dashboard</h1>
        </nav>
        <nav className="buttonNav">
          <button className="exitButton" onClick={() => {
            history.goBack();
          }}>
            <i className="material-icons clearIcon">arrow_back</i>
          </button>
        </nav>
        <main className="userProfileMain">
          <h1>rooms</h1>
          <Rooms />
          <h1>members</h1>
          <Users />
          <h1>traffic</h1>
          <Traffic />
          <button onClick={() => props.handleSignOut(userConfig)}>
            click here to sign out
          </button>
        </main>
      </section>
    </Modal>
  );
}

export default Dashboard;
