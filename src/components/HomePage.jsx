import React from "react";
import { Link } from "react-router-dom";
import Instructions from "./Instructions";
import "./HomePage.css";

export default () => {
  return (
    <div className="landing">
      <div className="landing-container">
        <h1 className="landing-container-header">Welcome to Words</h1>
        <h3>
          <Instructions />
        </h3>
        <div className="landing-container-buttons">
          <Link to="/create-room">
            <i className="fas fa-gamepad" />
            <button className="landing-container-button">Create Game</button>
          </Link>
          {/* <Link to="/rank" replace>
            <i className="fas fa-trophy" />
            <button className="landing-container-button">Rank</button>
          </Link> */}
          <Link to="/join-room" replace>
            <i className="fas fa-door-open" />
            <button className="landing-container-button">Join a room</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
