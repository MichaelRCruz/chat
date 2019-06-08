import React from 'react';
import Rooms from '../Rooms/Rooms';
import './Dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  };

  render() {
    const {firebase, subscribedRooms, setActiveRoom} = this.props;
    return (
      <section className="dashboardComponent">
        <Rooms
          firebase={firebase}
          subscribedRooms={subscribedRooms}
          setActiveRoom={setActiveRoom}
        />
      </section>
    );
  }
}

export default Dashboard;
