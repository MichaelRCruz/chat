import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import SessionContext from '../SessionContext.js';
import './Rooms.css';

class Rooms extends React.Component {
  static contextType = SessionContext;

  updateActiveRoom = key => {
    this.context.updateActiveRoom(key);
    // console.log(this.props);
    this.props.history.push(`/chat/rooms?key=${key}`);
  }

  // const urlRoom = this.props.match.params.roomid;
  // const { updateActiveRoom, activeRoom } = this.context.state;
  // console.log('match detected --->', urlRoom);

  render() {
    const { subscribedRooms } = this.context.state;
    const rooms = subscribedRooms.map((room, i) => {
      const { key, name } = room;
      return (
        <li className="subscribedRoom" key={key}>
          <Link
            to={`/chat/rooms?key=${key}`}
            onClick={this.updateActiveRoom.bind(this, key)}
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



// onClick={this.updateActiveRoom.bind(this, key)}
