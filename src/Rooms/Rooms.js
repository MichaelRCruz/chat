import React from 'react';
import { Link } from 'react-router-dom';
import SessionContext from '../SessionContext.js';
import './Rooms.css';

class Rooms extends React.Component {
  updateActiveRoom = key => {
    this.context.updateActiveRoom(key);
  }
  static contextType = SessionContext;
  render() {
    const { subscribedRooms } = this.context.state;
    const { metch } = this.props;
    const rooms = subscribedRooms.map((room, i) => {
      const { key, name } = room;
      return (
        <li className="subscribedRoom" key={key}>
          <Link
            className="roomNameButton"
            onClick={this.updateActiveRoom.bind(this, key)}>
            <div>
              <i className="material-icons people">people</i>
              <p className="roomName">{ name }</p>
            </div>
          </Link>
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
