import React from 'react';
import './Rooms.css';

class Rooms extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  };

  componentDidMount() {
    // let obj = {};
    // let result = [];
    // for (let i = 0; i < this.props.notifications; i++) {
    //   if (obj[arr[i]]) {
    //     obj[arr[i]]++;
    //   } else {
    //     obj[arr[i]] = 1;
    //     result.push(arr[i]);
    //   }
    // }
    // this.setState({ notifications: result });
  }

  render() {
    const { subscribedRooms, setActiveRoom, userConfig } = this.props;
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
