import React from 'react';
import SessionContext from '../SessionContext.js';
import './Rooms.css';

class Rooms extends React.Component {
  updateSession = activeRoom => {
    this.context.updateSession({ activeRoom });
  }

  static contextType = SessionContext;
  render() {
    const { subscribedRooms=[] } = this.context.state || {};
    const rooms = subscribedRooms.map((subscribedRoom, index) => {
      return (
        <li className="subscribedRoom" key={subscribedRoom.key}>
          <button
            className="roomNameButton"
            onClick={() => {
                this.updateRoom(subscribedRoom)
              }
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
