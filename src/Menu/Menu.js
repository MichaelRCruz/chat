import React from 'react';
import Rooms from '../Rooms/Rooms';
import Users from '../Users/Users';
import ResourceContext from '../ResourceContext.js';
import './Menu.css';

class Menu extends React.Component {

  static contextType = ResourceContext;
  static defaultProps = {
    acrtiveRoom: {},
    subscribedRooms: [],
    updateActiveRoom: () => {},
    users: {}
  };

  render() {
    const {activeRoom, subscribedRooms, updateActiveRoom, users } = this.props;
    const { user } = this.props;

    return (
      <section className="menuComponent">
        <div className="userAvatarContainer">
          <img
            className="userAvatar"
            alt="user"
            src={this.props.user.photoURL || ''}
           />
          <p className="menuDisplayName">{ this.props.user.displayName }</p>
        </div>
        <div className="menuRoomListContainer">
          <h1>rooms</h1>
          <Rooms
            subscribedRooms={subscribedRooms}
          />
        </div>
        <h1>users</h1>
        <Users users={users} />
      </section>
    );
  }
}

export default Menu;
