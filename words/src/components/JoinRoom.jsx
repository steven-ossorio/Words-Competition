import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase/secretKeys";
import "./HomePage.css";

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      accesscode: ""
    };

    this.createUser = this.createUser.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id !== "") {
      this.setState({ accesscode: this.props.match.params.id });
    }
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
      if (this.state.username !== "") {
        let db = firebase.database();
        let playersRef = db.ref(`Room/${this.state.accesscode}/players`);
        playersRef.child(`${id}`).set(`${this.state.username}`);
        let player = db.ref(`Room/${this.state.accesscode}/players/${id}`);
        player.onDisconnect().remove();

        let scoreBoard = db.ref(`Room/${this.state.accesscode}/scoreBoard`);
        scoreBoard.child(`${this.state.username}`).set(0);
        let playerScore = db.ref(
          `Room/${this.state.accesscode}/scoreBoard/${this.state.username}`
        );
        playerScore.onDisconnect().remove();
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
    return (
      <div className="landing">
        <div className="landing-container join-room">
          <h1 className="landing-container-header">Welcome to Word</h1>
          <form className="landing-container-form">
            <input
              type="text"
              placeholder="Enter a username"
              onChange={this.update("username")}
              value={this.state.username}
            />
            <input
              type="text"
              placeholder="Enter Access Code"
              onChange={this.update("accesscode")}
              value={this.state.accesscode}
            />
            <div className="landing-container-form-buttons">
              <Link to={`/waiting-room/${this.state.accesscode}`}>
                <button
                  className="landing-container-form-button"
                  onClick={this.createUser}
                >
                  Join a Room
                </button>
              </Link>
              <Link to="/" replace>
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

export default Join;
