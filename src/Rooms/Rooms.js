import React from 'react';
import ResourceContext from '../ResourceContext.js';
import './Rooms.css';

class Rooms extends React.Component {

  updateSession = activeRoom => {
    this.context.updateSession({ activeRoom });
  }

  render() {
    const { subscribedRooms } = this.props;
    console.log(subscribedRooms);
    const rooms = subscribedRooms.map((subscribedRoom, index) => {
      return (
        <li className="subscribedRoom" key={subscribedRoom.key}>
          <button
            className="roomNameButton"
            onClick={() => {
                this.updateRoom(subscribedRoom)}
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
