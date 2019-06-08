import React from 'react';
import Rooms from '../Rooms/Rooms';
import Users from '../Users/Users';
import './Menu.css';

class Menu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  };

  render() {
    const {firebase, activeRoom, user, userConfig, subscribedRooms, setActiveRoom} = this.props;
    return (
      <section className="menuComponent">
        <h1>rooms</h1>
        <Rooms
          firebase={firebase}
          activeRoom={activeRoom}
          user={user}
          userConfig={userConfig}
          subscribedRooms={subscribedRooms}
          setActiveRoom={setActiveRoom}
        />
        <h1>users</h1>
        <Users firebase={firebase} />
      </section>
    );
  }
}

export default Menu;
