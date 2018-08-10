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
  }

  updateCreate(e) {
    e.preventDefault();
    let create = !this.state.create;
    this.setState({ create });
  }

  render() {
    return (
      <div className="landing">
        <div className="landing-container">
          <h1 className="landing-container-header">Welcome to Word</h1>
          <div className="landing-container-buttons">
            <Link to="/create-room">
              <button className="landing-container-button">Create Game</button>
            </Link>
            <Link to="/join-room" replace>
              <button className="landing-container-button">Join a room</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
