import React from 'react';
import SessionContext from '../SessionContext.js';
import './Rooms.css';

class Rooms extends React.Component {

  static contextType = SessionContext;

  updateActiveRoom = activeRoom => {
    this.context.updateSession({ activeRoom });
  }

  render() {
    const { subscribedRooms } = this.context;
    const rooms = subscribedRooms.map((subscribedRoom, index) => {
      return (
        <li className="subscribedRoom" key={subscribedRoom.key}>
          <button
            className="roomNameButton"
            onClick={() => {
                this.updateActiveRoom(subscribedRoom)}
            }>
            <div>
              <i className="material-icons people">people</i>
              <p className="roomName">{ subscribedRoom.name }</p>
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
