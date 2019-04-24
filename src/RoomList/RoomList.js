import React, { Component } from 'react';
import './RoomList.css';
import Filter from 'bad-words';

class RoomList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rooms: [],
      newRoomName: ''
    }
    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.swearFilter = new Filter();
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      console.log('snapshot', snapshot.val());
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) })
      if (this.state.rooms.length === 1) { this.props.setRoom(room) }
    });
    this.roomsRef.on('child_removed', snapshot => {
      this.setState({ rooms: this.state.rooms.filter( room => room.key !== snapshot.key )  })
    });
  }

  createRoom(newRoomName) {
    if (newRoomName.length >= 30) {
      newRoomName = this.swearFilter.clean(newRoomName.substring(0, 30));
    }
    if (!this.props.user || !newRoomName) { return }
    if (this.state.rooms.length >= 5) {
      alert('Ricky, no more rooms!');
      return;
    } else {
      this.roomsRef.push({
        name: newRoomName,
        createdAt: Date.now(),
        creator: {email: this.props.user.email, displayName: this.props.user.displayName, photoURL: this.props.user.photoURL}
      });
    }
    this.setState({ newRoomName: '' });
  }

  handleChange(event) {
    this.setState({newRoomName: event.target.value });
  }

  removeRoom(room) {
    this.roomsRef.child(room.key).remove();
  }

  render() {
    const rooms = this.state.rooms.map(room => {
      return (
        <li key={room.key} className={ this.props.activeRoom && this.props.activeRoom.key === room.key ? 'active' : '' }>
          <button onClick={ () => this.props.setRoom(room) } className="room-name">{ room.name }</button>
          { room.creator && this.props.user && room.creator.email === this.props.user.email &&
            <button onClick={ () => this.removeRoom(room) } className="remove remove-room-button">&times;</button>
          }
        </li>
      );
    });
    return (
        <section id="room-component">
          <ul id="room-list">
            {rooms}
          </ul>

        { this.props.user !== null &&
          <form id="create-room" onSubmit={ (e) => { e.preventDefault(); this.createRoom(this.state.newRoomName) } }>
            <input type="text" value={ this.state.newRoomName } onChange={ this.handleChange.bind(this) } name="newRoomName" placeholder="Create a new room" />
            <input type="submit" value="+" />
          </form>
        }

      </section>
    );
  }
}

export default RoomList;
