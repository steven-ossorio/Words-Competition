import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import { Link } from "react-router-dom";
import "./JoinRoom.css";

class JoinRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      roomId: ""
    };

    this.update = this.update.bind(this);
    this.addUserToRoom = this.addUserToRoom.bind(this);
  }

  update(field) {
    return e => {
      this.setState({
        [field]: e.target.value
      });
    };
  }

  componentDidMount() {
    if (this.props.roomId) {
      this.setState({
        roomId: this.props.roomId
      });
    }
  }

  addUserToRoom() {
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

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Enter a username"
          onChange={this.update("username")}
        />
        <Link to={this.state.roomId} replace>
          <button onClick={this.addUserToRoom}>Join</button>
        </Link>
      </div>
    );
  }
}

export default JoinRoom;
