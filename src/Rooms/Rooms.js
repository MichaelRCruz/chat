import React from 'react';
import './Rooms.css';

class Rooms extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  };

  render() {
    const { subscribedRooms, setActiveRoom } = this.props;
    const rooms = subscribedRooms.map((subscribedRoom, index) => {
      return (
        <li className="subscribedRoom" key={subscribedRoom.key}>
          <button className="roomNameButton" onClick={() => {
            setActiveRoom(subscribedRoom)
          }}>
            { subscribedRoom.name }
          </button>
        </li>
      );
    });
    return (
      <section className="roomsComponent">
        <ul>
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
          {rooms}
        </ul>
      </section>
    );
  }
}

export default Rooms;
