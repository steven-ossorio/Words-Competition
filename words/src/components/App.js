import React, { Component } from "react";
import "./App.css";
import { Route } from "react-router-dom";
import Landing from "./Landing";
import CreatedRoom from "./CreatedRoom";
import Join from "./Join";
import CreateRoomPage from "./CreateRoomPage";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Route exact path="/" component={Landing} />
          <Route exact path="/create-room" component={CreateRoomPage} />
          <Route exact path="/waiting-room/:id" component={CreatedRoom} />
          <Route exact path="/join-room" component={Join} />
          <Route exact path="/join-room/:id" component={Join} />
        </header>
      </div>
    );
  }
}

export default App;
