import React, { Component } from 'react';

import './RoomList.css';

class RoomList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newRoomName: '',
      subscribedRooms: [],
      onlineUsers: []
    },
    this.subscribedUsersRef = this.props.firebase.database().ref('users');
  }

  componentDidMount() {
    const rooms = [];
    const subscribedRoomsIds = this.props.userConfig.rooms;
    const roomThrottler = this.throttling(() => {
      this.setState({subscribedRooms: rooms.slice(0)});
    }, 100);
    const subscribedRoomsRef = this.props.firebase.database().ref('rooms');
    subscribedRoomsRef.on('child_added', snapshot => {
      const room = Object.assign(snapshot.val(), {key: snapshot.key});
      if (subscribedRoomsIds.includes(room.key)) {
        rooms.push(room);
      }
      roomThrottler();
    });
    this.setOnlineUsers();
    const isOnlineRef = this.props.firebase.database().ref(`users`);
    this.subscribedUsersRef.on('child_changed', snapshot  => {
      this.setOnlineUsers();
    });
  }

  setOnlineUsers() {
    const users = [];
    const userThrottler = this.throttling(() => {
      this.setState({onlineUsers: users.slice(0)});
    }, 100);
    this.subscribedUsersRef.on('child_added', snapshot => {
      const user = Object.assign(snapshot.val(), {key: snapshot.key});
      if (user.activity.isOnline) {
        users.push(user);
      }
      userThrottler();
    });
  }

  throttling(callback, delay) {
    let timeout = null
    return function(...args) {
      if (!timeout) {
        timeout = setTimeout(() => {
          callback.call(this, ...args)
          timeout = null
        }, delay)
      }
    }
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

  render() {
    const { subscribedRooms } = this.state;
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
    const onlineUsers = this.state.onlineUsers.map((user, index) => {
      return (
        <li key={index}>
          <h1>{user.displayName}</h1>
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
        <div className="listContainer">
          <ul>
            {rooms}
          </ul>
          <ul>
            {onlineUsers}
          </ul>
        </div>
      </section>
    );
  }
}

export default RoomList;
