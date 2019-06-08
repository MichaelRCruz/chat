import React from 'react';
import './Rooms.css';

class Rooms extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  };

  render() {
    const { subscribedRooms, setActiveRoom } = this.props;
    const rooms = subscribedRooms.map((subscribedRoom, index) => {
      return (
        <li className="subscribedRoom" key={subscribedRoom.key}>
          <button className="roomNameButton" onClick={() => {
            setActiveRoom(subscribedRoom)
          }}>
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
