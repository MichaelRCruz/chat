import React from 'react';
import Users from '../Users/Users.js';
import {throttling} from '../utils.js';
import './RoomList.css';

class RoomList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      subscribedRooms: []
    }
    this.subscribedRoomsRef = this.props.firebase.database().ref('rooms');
  };

  componentDidMount() {

  };

  

  render() {
    const { subscribedRooms } = this.props;
    const rooms = subscribedRooms.map(subscribedRoom => {
      return (
        <li className="roomNameContainer" key={subscribedRoom.key}>
          <button className="roomName" onClick={() => {
            this.props.setActiveRoom(subscribedRoom)
          }}>
            { subscribedRoom.name }
          </button>
        </li>
      );
    });
    return (
      <section className="roomComponent">
        <div className="listContainer">
          <ul>
            {rooms}
          </ul>
        </div>
        <Users firebase={this.props.firebase} />
      </section>
    );
  }
}

export default RoomList;
