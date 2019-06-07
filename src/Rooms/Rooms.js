import React from 'react';
import './Rooms.css';

class Rooms extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  };

  render() {
    const { subscribedRooms } = this.props;
    const rooms = subscribedRooms.map(subscribedRoom => {
      return (
        <li className="roomNameContainer" key={subscribedRoom.key}>
          <button className="roomName" onClick={() => {
            this.props.setActiveRoom(subscribedRoom)
          }}>
            { subscribedRoom.name }
          </button>
        </li>
      );
    });
    return (
      <section className="roomComponent">
        <ul>
          {rooms}
        </ul>
      </section>
    );
  }
}

export default Rooms;
