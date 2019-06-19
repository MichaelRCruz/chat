import React from 'react';
import SessionContext from '../SessionContext.js';
import './Rooms.css';

class Rooms extends React.Component {
  updateActiveRoom = activeRoom => {
    this.context.updateActiveRoom(activeRoom);
  }
  static defaultProps = {
    onUpdateRoom: () => {},
  }
  static contextType = SessionContext;
  render() {
    const { subscribedRooms=[] } = this.context.state || {};
    const rooms = subscribedRooms.map((room, index) => {
      return (
        <li className="subscribedRoom" key={room.key}>
          <button
            className="roomNameButton"
            onClick={this.updateActiveRoom.bind(this, room.key)}>
            <div>
              <i className="material-icons people">people</i>
              <p className="roomName">{ room.name }</p>
            </div>
          </button>
        </li>
      );
    });
    return (
      <section className="roomsComponent">
        <ul>
          {rooms}
        </ul>
      </section>
    );
  }
}

export default Rooms;
