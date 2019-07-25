import React from 'react';
import Rooms from '../Rooms/Rooms';
import Users from '../Users/Users';
import Traffic from '../Users/Traffic';
import SessionContext from '../SessionContext.js';
import './Menu.css';

class Menu extends React.Component {

  static contextType = SessionContext;



  render() {

    const { user } = this.context.state;

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
          <Users />
          <h1>traffic</h1>
          <Traffic />
        </div>
      </aside>
    );
  }

}

export default Menu;
