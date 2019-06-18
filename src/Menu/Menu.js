import React from 'react';
import Rooms from '../Rooms/Rooms';
import Users from '../Users/Users';
import ResourceContext from '../ResourceContext.js';
import './Menu.css';

class Menu extends React.Component {
  render() {
    const { subscribedRooms, users, user } = this.props;
    // console.log(this.context.state);
    return (
      <section className="menuComponent">
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
          <Rooms subscribedRooms={subscribedRooms}
          />
        </div>
        <h1>users</h1>
        <Users users={users} />
      </section>
    );
  }
}

export default Menu;
