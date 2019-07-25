import React, { useContext, useEffect } from 'react';
import Rooms from '../Rooms/Rooms';
import Users from '../Users/Users';
import Traffic from '../Users/Traffic';
import SessionContext from '../SessionContext.js';
import './Menu.css';

const Menu = () => {

  // static contextType = SessionContext;

  const sessionContext = useContext(SessionContext);
  const { state } = sessionContext;
  const { user, activeRoom } = state;

  useEffect(() => {
    return () => {
      // setIsAuthLinkSent(false);
      // setIsOAuthCanceled(true);
    }
  }, [user, activeRoom]);

  return (
    <aside className="menuComponent">
      <div className="userAvatarContainer">
        <img
          className="userAvatar"
          alt="user"
          src={user ? user.photoURL : ''}
         />
        <p className="menuDisplayName">{ user.displayName }</p>
      </div>
      <div className="menuRoomListContainer">
        <h1>rooms</h1>
        <Rooms />
        <h1>members</h1>
        <Users activeRoom={activeRoom} />
        <h1>traffic</h1>
        <Traffic />
      </div>
    </aside>
  );

}

export default Menu;
