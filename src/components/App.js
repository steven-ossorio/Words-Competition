import React, { Component } from "react";
import { Route } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import HomePage from "./HomePage";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/create-room" component={CreateRoom} />
          <Route exact path="/waiting-room/:id" component={WaitingRoom} />
          <Route exact path="/join-room" component={JoinRoom} />
          <Route exact path="/join-room/:id" component={JoinRoom} />
        </header>
      </div>
    );
  }
}

export default App;
