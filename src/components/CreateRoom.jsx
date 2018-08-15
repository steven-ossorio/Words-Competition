import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase/secretKeys";
import "./WaitingRoom.css";

class CreateRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      roomId: "",
      errors: "",
      isMounted: false
    };

    this.createUser = this.createUser.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.setState({ isMounted: true }, () => {
      if (this.state.isMounted) {
        this.setState({ isMounted: false });
        let db = firebase.database();
        let roomRefKey = db.ref("Room").push().key;
        this.setState({
          roomId: roomRefKey
        });
      }
    });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  createUser(e) {
    if (this.state.username === "") {
      e.preventDefault();
      this.setState({
        errors: "Username can't be blank"
      });

      return;
    }

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
              resolve(user.uid);
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

      let allPlayers = db.ref(`Room/${this.state.roomId}/all-players`);
      allPlayers.child(`${id}`).set(true);
      let allPlayer = db.ref(`Room/${this.state.roomId}/all-players/${id}`);
      allPlayer.onDisconnect().remove();

      let scoreBoard = db.ref(`Room/${this.state.roomId}/scoreBoard`);
      scoreBoard.child(`${this.state.username}`).set(0);
      let playerScore = db.ref(
        `Room/${this.state.roomId}/scoreBoard/${this.state.username}`
      );
      playerScore.onDisconnect().remove();

      let creator = db.ref(`Room/${this.state.roomId}`);
      creator.child("creator").set(`${id}`);

      db.ref(`Room/${this.state.roomId}`)
        .child("gameStarted")
        .set(false);

      if (this.state.isMounted) {
        this.setState({
          username: "",
          errors: ""
        });
      }
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
    let errors = "";
    if (this.state.errors.length > 0) {
      errors = <div className="create-errors">{this.state.errors}</div>;
    }

    return (
      <div className="landing">
        <div className="landing-container create-room">
          <h1 className="landing-container-header">Welcome to Words</h1>
          <form className="landing-container-form">
            <input
              type="text"
              placeholder="Enter a username"
              onChange={this.update("username")}
              maxLength="10"
            />
            {errors}
            <div className="landing-container-form-buttons">
              <Link
                onClick={this.createUser}
                to={`/waiting-room/${this.state.roomId}`}
                replace
              >
                <i className="fas fa-gamepad" />
                <button
                  className="landing-container-form-button"
                  id="create-button"
                >
                  Create a Room
                </button>
              </Link>
              <Link to="/" replace>
                <i className="fas fa-arrow-circle-left" />
                <button className="landing-container-form-button">
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
