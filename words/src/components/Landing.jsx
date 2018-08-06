import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import config from '../firebase/secretKeys';
import firebase from 'firebase';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      create: false,
      back: false,
      roomId: ''
    }

    this.createRoom = this.createRoom.bind(this);
  }

  updatecCreate() {
    this.setState({ create: true })
  }

  createRoom(){
    let db = firebase.database();
    let reference = db.ref("Room").push({
        players: [{ username: "John" }],
        letters: ["0", "e", "i"],
        words: []
    }).key;

    this.setState({
      roomId: reference
    })
  }
  render() {
    if (!this.state.create) {
      return (
        <div>
          <h1>Welcome to Word</h1>
          <button onClick={this.updatecCreate.bind(this)}>Create Game</button>
        </div>
      )
    } else {
      return (
        <div>
          <Link to={this.state.roomId} replace><button onClick={this.createRoom}>Create a Room</button></Link>
        </div>
      )
    }
  }
}

export default Landing;