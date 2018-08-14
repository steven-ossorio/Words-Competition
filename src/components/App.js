import React, { Component } from "react";
import { Route } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import HomePage from "./HomePage";
import FinalScore from "./FinalScore";
import Rank from "./Rank";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/rank" component={Rank} />
          <Route exact path="/create-room" component={CreateRoom} />
          <Route exact path="/join-room" component={JoinRoom} />
          <Route exact path="/join-room/:id" component={JoinRoom} />
          <Route exact path="/waiting-room/:id" component={WaitingRoom} />
          <Route exact path="/final-score/:id" component={FinalScore} />
        </header>
      </div>
    );
  }
}

export default App;
