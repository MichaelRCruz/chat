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
    const rooms = subscribedRooms.map((subscribedRoom, index) => {
      return (
        <li className="subscribedRoom" key={subscribedRoom.key}>
          <button className="roomNameButton" onClick={() => {
            this.props.setActiveRoom(subscribedRoom)
          }}>
            { subscribedRoom.name }
          </button>
        </li>
      );
    });
    return (
      <section className="roomsComponent">
        <h1>rooms</h1>
        <ul>
          {rooms}
        </ul>
      </section>
    );
  }
}

export default Rooms;
