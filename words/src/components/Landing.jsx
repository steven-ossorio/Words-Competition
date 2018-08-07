import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase/secretKeys";

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      create: false,
      back: false,
      roomId: "",
      username: "",
      currentUser: "",
      userId: ""
    };

    this.userId = "";
    this.currentUserUid = "";
    this.update = this.update.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  componentDidMount() {
    let db = firebase.database();
    let roomRefKey = db.ref("Room").push().key;
    this.setState({
      roomId: roomRefKey
    });
  }

  updatecCreate() {
    this.setState({ create: true });
  }

  createUser() {
    const loginPromise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.user = user;
          resolve(user.uid);
        } else {
          firebase
            .auth()
            .signInAnonymously()
            .then(() => {
              console.log("logged in");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    });
    loginPromise.then(id => {
      let db = firebase.database();
      let playersRef = db.ref(`Room/${this.state.roomId}/players`);
      playersRef.child(`${id}`).set(`${this.state.username}`);
      let player = db.ref(`Room/${this.state.roomId}/players/${id}`);
      player.onDisconnect().remove();
    });
  }

  update(field) {
    return e => {
      this.setState({
        [field]: e.target.value
      });
    };
  }

  render() {
    if (!this.state.create) {
      return (
        <div>
          <h1>Welcome to Word</h1>
          <button onClick={this.updatecCreate.bind(this)}>Create Game</button>
        </div>
      );
    } else {
      return (
        <div>
          <input
            type="text"
            placeholder="Enter a username"
            onChange={this.update("username")}
          />
          <Link to={this.state.roomId} replace>
            <button onClick={this.createUser}>Create a Room</button>
          </Link>
        </div>
      );
    }
  }
}

export default Landing;
