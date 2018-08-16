import React, { Component } from "react";
import "./Timer.css";
import firebase from "../firebase/secretKeys";

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 60,
      tenSeconds: false,
      isMounted: false
    };
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    if (this.state.time === 0) {
      return;
    }
    let countDown = setInterval(() => {
      let tenSeconds = this.state.time <= 10 ? true : false;
      if (this.state.isMounted) {
        this.setState({ time: this.state.time - 1, tenSeconds });
      }
      if (this.state.time === 0) {
        clearInterval(countDown);
      }
      let db = firebase.database();
      let timeRef = db.ref(`Room/${this.props.gameID}`);
      timeRef.child("time").set(this.state.time);
    }, 1000);
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
    let db = firebase.database();
    db.ref(`Room/${this.props.gameID}`).off("value");
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
