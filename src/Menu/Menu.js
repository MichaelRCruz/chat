import React, { useContext, useEffect } from 'react';
import Rooms from '../Rooms/Rooms.js';
import Users from '../Traffic/Users.js';
import Traffic from '../Traffic/Traffic.js';
import SessionContext from '../SessionContext.js';
import './Menu.css';

const Menu = () => {
  const sessionContext = useContext(SessionContext);
  const { state } = sessionContext;
  const { user } = state;

  return (
    <main className="menuComponent">
      <section className="userAvatarCard">
        <img className="userAvatar"
          alt="avatar"
          src={user ? user.photoURL : ''}
         />
        <p className="menuDisplayName">{user.displayName}</p>
      </section>
      <section className="roomsCard">
        <Rooms />
      </section>
      <section className="usersCard">
        <Users />
      </section>
      <section className="trafficCard">
        <Traffic />
      </section>
    </main>
  );
};

export default Menu;
