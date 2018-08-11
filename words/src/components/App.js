import React, { Component } from "react";
import "./App.css";
import { Route } from "react-router-dom";
import CreatedRoom from "./CreatedRoom";
import Join from "./Join";
import CreateRoomPage from "./CreateRoomPage";
import HomePage from "./HomePage";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/create-room" component={CreateRoomPage} />
          <Route exact path="/waiting-room/:id" component={CreatedRoom} />
          <Route exact path="/join-room" component={Join} />
          <Route exact path="/join-room/:id" component={Join} />
          {/* <Route exact path="/game/:id" component={GameStart} /> */}
        </header>
      </div>
    );
  }
}

export default App;
