import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from '../firebase/secretKeys';
import firebase from 'firebase';
import { Route } from 'react-router-dom';
import Landing from './Landing';

class App extends Component {
  createGameRoom() {
    let app = firebase.initializeApp(config);
    let db = app.database();
    let reference = db.ref("Room").push({
        players: [{ username: "John" }],
        letters: ["0", "e", "i"],
        words: []
    }).key;
  }
  render() {
    return (
      <div>
        <header>
          <Route exact path="/" component={Landing} />
          {/* <Route exact path="/:id" component={} /> */}
        </header>
      </div>
    );
  }
}

export default App;
