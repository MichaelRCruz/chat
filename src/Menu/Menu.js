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
    <aside className="menuComponent">
      <section className="userAvatarContainer">
        <img className="userAvatar"
          alt="avatar"
          src={user ? user.photoURL : ''}
         />
        <p className="menuDisplayName">{user.displayName}</p>
      </section>
      <section>
        <h1>rooms</h1>
        <Rooms />
      </section>
      <section>
        <h1>members</h1>
        <Users />
      </section>
      <section>
        <h1>traffic</h1>
        <Traffic />
      </section>
    </aside>
  );
};

export default Menu;
