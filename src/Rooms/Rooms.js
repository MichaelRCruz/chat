import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import SessionContext from '../SessionContext.js';
// import './Rooms.css';

class Rooms extends React.Component {

  static contextType = SessionContext;

  render() {
    const { subscribedRooms } = this.context.state;
    const rooms = subscribedRooms.map((room, i) => {
      const { key, name } = room;
      return (
        <li className="subscribedRoom" key={key}>
          <Link
            to={`/chat/rooms?rm=${key}`}
            className="roomNameButton">
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
};

export default withRouter(Rooms);
