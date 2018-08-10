import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import Join from "./Join";
import CreateRoomPage from "./CreateRoomPage";

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      create: false,
      joinRoom: false,
      back: false
    };

    this.updateCreate = this.updateCreate.bind(this);
    this.updateJoinRoom = this.updateJoinRoom.bind(this);
  }

  updateCreate(e) {
    e.preventDefault();
    let create = !this.state.create;
    this.setState({ create });
  }

  updateJoinRoom(e) {
    e.preventDefault();
    let joinRoom = !this.state.joinRoom;
    this.setState({ joinRoom });
  }

  render() {
    if (!this.state.create && !this.state.joinRoom) {
      return (
        <div className="landing">
          <div className="landing-container">
            <h1 className="landing-container-header">Welcome to Word</h1>
            <div className="landing-container-buttons">
              <button
                className="landing-container-button"
                onClick={this.updateCreate}
              >
                Create Game
              </button>
              <Link to="/join-room">
                <button
                  className="landing-container-button"
                  onClick={this.updateJoinRoom}
                >
                  Join a room
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    } else if (this.state.joinRoom && !this.state.create) {
      return (
        <div className="landing">
          <Join updateJoinRoom={this.updateJoinRoom} />
        </div>
      );
    } else if (this.state.create && !this.state.joinRoom) {
      return (
        <div>
          <CreateRoomPage updateCreate={this.updateCreate} />
        </div>
      );
    }
  }
}

export default Landing;
