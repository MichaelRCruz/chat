import React from 'react';
import ResourceContext from '../ResourceContext.js';
import './Rooms.css';

class Rooms extends React.Component {

  static contextType = ResourceContext;
  static defaultProps = {
    subscribedRooms: [],
    updateActiveRoom: () => {}
  };

  updateActiveRoom = activeRoom => {
    this.context.updateActiveRoom({ activeRoom });
  }

  render() {
    const { subscribedRooms } = this.props;
    const fallbackRooms = subscribedRooms ? subscribedRooms : [];
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
