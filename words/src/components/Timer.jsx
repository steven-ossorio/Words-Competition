import React, { Component } from "react";
import "./Timer.css";

class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 60
    };
  }

  componentDidMount() {
    let countDown = setInterval(() => {
      this.setState({ time: this.state.time - 1 });
      if (this.state.time === 0) {
        clearInterval(countDown);
      }
    }, 1000);
  }
  render() {
    return (
      <div>
        <div className="time">{this.state.time}</div>
      </div>
    );
  }
}
export default Timer;
