import React, { useState, useContext, useEffect } from 'react';
import Rooms from '../Rooms/Rooms.js';
import Users from '../Traffic/Users.js';
import Traffic from '../Traffic/Traffic.js';
import Modal from '../Modal/Modal.js';
// import SessionContext from '../SessionContext.js';
import './Dashboard.css';

const Dashboard = props => {

  // const sessionContext = useContext(SessionContext);
  // const { userConfig } = sessionContext.state;

  const { history } = props;
  const potatoDashStore = localStorage.getItem('potatoDashStore');
  const [mode, setMode] = useState(potatoDashStore ? potatoDashStore : 'USERS');

  const handleNav = mode => {
    switch(mode) {
  		case 'BACK':
        return history.goBack();
  		case 'USERS':
        localStorage.setItem('potatoDashStore', 'USERS');
        return setMode(mode);
      case 'ROOMS':
        localStorage.setItem('potatoDashStore', 'ROOMS');
        return setMode(mode);
  		default:
        localStorage.setItem('potatoDashStore', 'USERS');
        return setMode('USERS');
  	}
  }

  return (
    <Modal show={true}>
      <section className="dashboardComponent">
        <header>
          <h1>dashboard</h1>
        </header>
        <nav>
          <button className="exitButton"
            onClick={() => handleNav('BACK')}>
            <i className="material-icons">arrow_back</i>
          </button>
          <button className="navToUsers"
            onClick={() => handleNav('USERS')}>
            <i className="material-icons">people</i>
          </button>
          <button className="navToRooms"
            onClick={() => handleNav('ROOMS')}>
            <i className="material-icons">room</i>
          </button>
        </nav>
        <main>
          {mode === 'USERS' ? <Users /> : null}
          {mode === 'ROOMS' ? <Rooms /> : null}
        </main>
      </section>
    </Modal>
  );
}

export default Dashboard;
