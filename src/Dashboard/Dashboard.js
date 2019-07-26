import React, { useState, useContext } from 'react';
import Rooms from '../Rooms/Rooms.js';
import Users from '../Traffic/Users.js';
import Traffic from '../Traffic/Traffic.js';
import Modal from '../Modal/Modal.js';
// import SessionContext from '../SessionContext.js';
import './Dashboard.css';

const Dashboard = props => {

  // const sessionContext = useContext(SessionContext);
  // const { userConfig } = sessionContext.state;

  const { history, location } = props;
  const potatoDashStore = localStorage.getItem('potatoDashStore');
  const [mode, setMode] = useState(potatoDashStore || 'USERS');

  const handleNav = mode => {
    switch(mode) {
  		case null:
        return history.goBack();
  		case 'USERS':
        localStorage.setItem('potatoDashStore', mode);
        return setMode(mode);
      case 'ROOMS':
        localStorage.setItem('potatoDashStore', mode);
        return setMode(mode);
      case 'TRAFFIC':
        localStorage.setItem('potatoDashStore', mode);
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
          <p>{location.pathname}</p>
        </header>
        <nav>
          <button className="exitButton"
            onClick={() => handleNav(null)}>
            <i className="material-icons">arrow_back_ios</i>
          </button>
        </nav>
        <main>
          {mode === 'USERS' ? <div className="dashContainer"><Users /></div> : null}
          {mode === 'ROOMS' ? <div className="dashContainer"><Rooms /></div> : null}
          {mode === 'TRAFFIC' ? <div className="dashContainer"><Traffic /></div> : null}
        </main>
        <nav className="dashboardNav">
          <button className="navToUsers"
            onClick={() => handleNav('USERS')}>
            <div>
              <i className="material-icons">people</i>
              <p>people</p>
            </div>
          </button>
          <button className="navToChannels"
            onClick={() => handleNav('ROOMS')}>
            <div>
              <i className="material-icons">room</i>
              <p>channels</p>
            </div>
          </button>
          <button className="navToTraffic"
            onClick={() => handleNav('TRAFFIC')}>
            <div>
              <i className="material-icons">public</i>
              <p>traffic</p>
            </div>
          </button>
        </nav>
      </section>
    </Modal>
  );
}

export default Dashboard;
