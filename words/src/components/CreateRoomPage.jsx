import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase/secretKeys";
import "./Landing.css";

class CreateRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      roomId: ""
    };

    this.createUser = this.createUser.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    let db = firebase.database();
    let roomRefKey = db.ref("Room").push().key;

    this.setState({
      roomId: roomRefKey
    });
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
            .then(user => {
              console.log("logged in");
              console.log(user);
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

      let scoreBoard = db.ref(`Room/${this.state.roomId}/scoreBoard`);
      scoreBoard.child(`${this.state.username}`).set(0);
      let playerScore = db.ref(
        `Room/${this.state.roomId}/scoreBoard/${this.state.username}`
      );
      playerScore.onDisconnect().remove();

      db.ref(`Room/${this.state.roomId}`)
        .child("gameStarted")
        .set(false);
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
    return (
      <div className="landing">
        <div className="landing-container create-room">
          <h1 className="landing-container-header">Welcome to Word</h1>
          <form className="landing-container-form">
            <input
              type="text"
              placeholder="Enter a username"
              onChange={this.update("username")}
            />
            <div className="landing-container-form-buttons">
              <Link to={this.state.roomId} replace>
                <button
                  className="landing-container-form-button"
                  onClick={this.createUser}
                >
                  Create a Room
                </button>
              </Link>
              <Link to="/" replace>
                <button
                  className="landing-container-form-button"
                  onClick={this.props.updateCreate}
                >
                  Go Back
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateRoomPage;
