import React, { Component } from "react";
import "./Timer.css";
import firebase from "../firebase/secretKeys";

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 3
    };
  }

  componentDidMount() {
    let countDown = setInterval(() => {
      this.setState({ time: this.state.time - 1 });
      if (this.state.time === 0) {
        clearInterval(countDown);
      }
      let db = firebase.database();
      let timeRef = db.ref(`Room/${this.props.gameID}`);
      timeRef.child("time").set(this.state.time);
    }, 1000);
  }
  render() {
    return (
      <div className="time-container">
        <div className="time">{this.state.time}</div>
      </div>
    );
  }
}
export default Timer;
