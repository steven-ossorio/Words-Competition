import React, { Component } from "react";
import { Link } from "react-router-dom";
import Instructions from "./Instructions";
import "./HomePage.css";

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
          <h1 className="landing-container-header">Welcome to Words</h1>
          <h3>
            <Instructions />
          </h3>
          <div className="landing-container-buttons">
            <Link to="/create-room">
              <i class="fas fa-gamepad" />
              <button className="landing-container-button">Create Game</button>
            </Link>
            <Link to="/join-room" replace>
              <i class="fas fa-door-open" />
              <button className="landing-container-button">Join a room</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
