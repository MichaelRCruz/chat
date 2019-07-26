import React from 'react';
import Rooms from '../Rooms/Rooms.js';
import Users from '../Traffic/Users.js';
import Traffic from '../Traffic/Traffic.js';
import './Dashboard.css';

const Dashboard = () => {

  return (
    <section className="dashboardComponent">
      <div className="menuRoomListContainer">
        <h1>rooms</h1>
        <Rooms />
        <h1>members</h1>
        <Users />
        <h1>traffic</h1>
        <Traffic />
      </div>
    </section>
  );
}

export default Dashboard;
