import React from 'react';
import SessionContext from '../SessionContext.js';
import './Rooms.css';

class Rooms extends React.Component {
  changeRoom = key => {
    this.context.changeRoom(key);
  }
  static contextType = SessionContext;
  render() {
    const { subscribedRooms } = this.context.state;
    const { metch } = this.props;
    const rooms = subscribedRooms.map((room, i) => {
      const { key, name } = room;
      return (
        <li className="subscribedRoom" key={key}>
          <button
            className="roomNameButton"
            onClick={this.changeRoom.bind(this, key)}>
            <div>
              <i className="material-icons people">people</i>
              <p className="roomName">{ name }</p>
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
