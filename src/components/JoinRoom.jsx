import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase/secretKeys";
import "./HomePage.css";

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      accesscode: "",
      errors: ""
    };

    this.createUser = this.createUser.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id !== undefined) {
      this.setState({ accesscode: this.props.match.params.id });
    }
  }

  createUser(e) {
    if (this.state.username.length === 0) {
      e.preventDefault();
      this.setState({
        errors: "Username can't be blank"
      });
      return;
    }

    if (this.state.accesscode.length === 0) {
      e.preventDefault();
      this.setState({
        errors: "Access Code can't be blank"
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
            .then(() => {})
            .catch(err => {
              console.log(err);
            });
        }
      });
    });
    loginPromise.then(id => {
      if (this.state.username.length === 0) {
        e.preventDefault();
        this.setState({
          errors: "Username can't be blank"
        });
        return;
      }

      if (this.state.accesscode.length === 0) {
        e.preventDefault();
        this.setState({
          errors: "Access Code can't be blank"
        });
        return;
      }

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
                <i className="fas fa-door-open" />
                <button
                  className="landing-container-form-button"
                  onClick={this.createUser}
                >
                  Join a Room
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

export default Join;
