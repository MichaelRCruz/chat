import React, { Component } from 'react';

import './RoomList.css';

class RoomList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newRoomName: '',
      subscribedRooms: props.subscribedRooms
    }
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
    // this.roomsRef.on('child_added', snapshot => {
    //   const room = snapshot.val();
    //   room.key = snapshot.key;
    //   this.setState({ rooms: this.state.rooms.concat(room)});
    //   // if (this.state.rooms.length === 1) { this.props.setRoom(room) }
    // });
    // this.roomsRef.on('child_removed', snapshot => {
    //   this.setState({rooms: this.state.rooms.filter(room => room.key !== snapshot.key)})
    // });
    // const subscribedRooms = this.state.rooms.filter(room => {
    //   return this.props.userConfig.rooms.includes(room.key);
    // });
    // this.setState({
    //   rooms: this.props.userConfig.rooms
    // });
    // this.setState({
    //   subscribedRooms: this.props.subscribedRooms
    // }, () => { console.log('we good', this.state.subscribedRooms) });
  }

  componentWillReceiveProps(prevProps, nextProps) {
    // console.log(prevProps, nextProps);
    // this.setState({
    //   subscribedRooms: nextProps.subscribedRooms
    // });
  }

  createRoom(newRoomName) {
    // if (newRoomName.length >= 30) {
    //   newRoomName = newRoomName.substring(0, 30);
    // }
    // if (!this.props.user || !newRoomName) { return };
    // if (this.state.rooms.length >= 5) {
    //   alert('Ricky, no more rooms!');
    //   return;
    // } else {
    //   this.roomsRef.push({
    //     active: false,
    //     createdAt: Date.now(),
    //     creator: this.props.user.uid,
    //     description: 'Your very first potato! How will you describe it?',
    //     moderators: {
    //       0: this.props.user.uid
    //     },
    //     name: `${this.props.user.displayName}'s potato`
    //   });
    // }
    // this.setState({ newRoomName: '' });
    console.log('createRoom() invoked');
  }

  handleChange(event) {
    this.setState({newRoomName: event.target.value });
  }

  removeRoom(room) {
    this.roomsRef.child(room).remove();
  }

  // setRoom = room => {
  //   console.log('do the thing', room);
  //   this.props.setActiveRoom(room.key);
  // }

  render() {
    console.log(this.state);
    console.log(this.props);
    const { subscribedRooms } = this.state;
    const rooms = subscribedRooms.map(subscribedRoom => {
      return (
        <li className="roomNameContainer" key={subscribedRoom.key}>
          <button className="roomName" onClick={() => this.props.setActiveRoom(subscribedRoom)}>
            { subscribedRoom.name }
          </button>
          <button className="deleteButton"
                  onClick={() => this.removeRoom(subscribedRoom.key)}
          >
            &times;
          </button>
        </li>
      );
    });
    const form = (
      <form className="createRoomForm" onSubmit={(e) => {
          e.preventDefault();
          this.createRoom(this.state.newRoomName);
        }}>
        <input className="textInput"
          type="text" value={this.state.newRoomName}
          onChange={ this.handleChange.bind(this) }
          name="newRoomName" placeholder="Create a new room"
        />
        <input type="submit" value="+" />
      </form>
    );
    return (
      <section className="roomComponent">
        <div className={!this.props.showMenu ? "listContainer animated bounceInLeft" : "listContainer animated bounceOutLeft"}>
          {form}
          <ul>
            {rooms}
          </ul>
        </div>
      </section>
    );
  }
}

export default RoomList;
