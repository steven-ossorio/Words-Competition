import React, { Component } from "react";
import "./Timer.css";
import firebase from "../firebase/secretKeys";

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 3,
      tenSeconds: false
    };
  }

  componentDidMount() {
    let countDown = setInterval(() => {
      let tenSeconds = this.state.time <= 10 ? true : false;
      this.setState({ time: this.state.time - 1, tenSeconds });
      if (this.state.time === 0) {
        clearInterval(countDown);
      }
      let db = firebase.database();
      let timeRef = db.ref(`Room/${this.props.gameID}`);
      timeRef.child("time").set(this.state.time);
    }, 1000);
  }
  render() {
    let color = "";
    if (this.state.tenSeconds) {
      color = "#ff0000";
    }
    return (
      <div style={{ color: `${color}` }} className="time-container">
        <div className="time">{this.state.time}</div>
      </div>
    );
  }
}
export default Timer;
