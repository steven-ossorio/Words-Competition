import React, { Component } from "react";
import "./App.css";
import { Route } from "react-router-dom";
import Landing from "./Landing";
import CreatedRoom from "./CreatedRoom";

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <Route exact path="/" component={Landing} />{" "}
          <Route exact path="/: id " component={CreatedRoom} />{" "}
        </header>{" "}
      </div>
    );
  }
}

export default App;
