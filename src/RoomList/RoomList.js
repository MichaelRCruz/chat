import React, { Component } from 'react';

import './RoomList.css';

class RoomList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newRoomName: '',
      subscribedRooms: []
    }
  }

  componentDidMount() {
    const rooms = [];
    const subscribedRoomsIds = this.props.userConfig.rooms;
    const throttler = this.throttling(() => {
      this.setState({subscribedRooms: rooms.slice(0)});
    }, 100);
    const subscribedRoomsRef = this.props.firebase.database().ref('rooms');
    subscribedRoomsRef.on('child_added', snapshot => {
      const room = Object.assign(snapshot.val(), {key: snapshot.key});
      if (subscribedRoomsIds.includes(room.key)) {
        rooms.push(room);
      }
      throttler();
    });
    const unsubscribedRoomsRef = this.props.firebase.database().ref('rooms');
    unsubscribedRoomsRef.on('child_added', snapshot => {
      this.setState({subscribedRooms: this.state.subscribedRooms.filter( message => message.key !== snapshot.key)});
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

  // getSubscribedRooms(subscribedRoomsIds) {
  //   return new Promise((resolve, reject) => {
  //     let rooms = [];
  //     const subscribedRoomsRef = this.props.firebase.database().ref('rooms');
  //     if (!subscribedRoomsRef) {
  //       reject(new Error('subscirbed room does not exist'), null);
  //     }
  //     subscribedRoomsRef.on('child_added', snapshot => {
  //       let room = Object.assign(snapshot.val(), {key: snapshot.key});
  //       rooms.push(room);
  //     });
  //     resolve(rooms);
  //   });
  // }
  //
  // getSubscribedRooms(subscribedRoomsIds) {
  //   const rooms = [];
  //   const throttler = this.throttling(() => {
  //     this.setState({subscribedRooms: rooms.slice(0)}
  //   }, 100);
  //   const subscribedRoomsRef = this.props.firebase.database().ref('rooms');
  //   subscribedRoomsRef.on('child_added', snapshot => {
  //     let room = Object.assign(snapshot.val(), {key: snapshot.key});
  //     rooms.push(room);
  //     throttler();
  //   });
  //   const unsubscribedRoomsRef = this.props.firebase.database().ref('rooms');
  //   unsubscribedRoomsRef.on('child_added', snapshot => {
  //     this.setState({subscribedRooms: this.state.subscribedRooms.filter( message => message.key !== snapshot.key)}
  //   });
  // }

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
    const { subscribedRooms } = this.state;
    const rooms = subscribedRooms.map(subscribedRoom => {
      return (
        <li className="roomNameContainer" key={subscribedRoom.key}>
          <button className="roomName" onClick={() => {
            this.props.setActiveRoom(subscribedRoom)
          }}>
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
