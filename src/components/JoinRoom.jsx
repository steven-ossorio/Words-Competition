import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import "./HomePage.css";

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      accesscode: "",
      errors: {},
      isMounted: false
    };

    this.createUser = this.createUser.bind(this);
    this.update = this.update.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    if (this.props.match.params.id !== undefined) {
      this.setState({ accesscode: this.props.match.params.id });
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  createUser(e) {
    e.preventDefault();

    if (
      this.state.username.length === 0 &&
      this.state.accesscode.length === 0
    ) {
      this.setState({
        errors: {
          username: "Username can't be blank",
          accesscode: "Access Code can't be blank"
        }
      });
      return;
    }

    if (this.state.username.length === 0) {
      this.setState({
        errors: { username: "Username can't be blank", accesscode: "" }
      });
      return;
    }

    if (this.state.accesscode.length === 0) {
      this.setState({
        errors: { username: "", accesscode: "Access Code can't be blank" }
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
      let playersRef = db.ref(`Room/${this.state.accesscode}/players`);
      playersRef.child(`${id}`).set(`${this.state.username}`);
      let player = db.ref(`Room/${this.state.accesscode}/players/${id}`);
      player.onDisconnect().remove();

      let allPlayers = db.ref(`Room/${this.state.accesscode}/all-players`);
      allPlayers.child(`${id}`).set(true);
      let allPlayer = db.ref(`Room/${this.state.accesscode}/all-players/${id}`);
      allPlayer.onDisconnect().remove();

      let scoreBoard = db.ref(`Room/${this.state.accesscode}/scoreBoard`);
      scoreBoard.child(`${this.state.username}`).set(0);
      let playerScore = db.ref(
        `Room/${this.state.accesscode}/scoreBoard/${this.state.username}`
      );
      playerScore.onDisconnect().remove();

      this.props.history.push({
        pathname: `/waiting-room/${this.state.accesscode}`
      });
    });
  }

  goBack(e) {
    e.preventDefault();
    this.props.history.push({
      pathname: "/"
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
    let usernameError = this.state.errors["username"] ? (
      <div className="create-errors">{this.state.errors["username"]}</div>
    ) : (
      ""
    );
    let accesscodeError = this.state.errors["accesscode"] ? (
      <div className="create-errors">{this.state.errors["accesscode"]}</div>
    ) : (
      ""
    );
    return (
      <div className="landing">
        <div className="landing-container join-room">
          <h1 className="landing-container-header">Welcome to Word</h1>
          <form className="landing-container-form">
            <div>
              <input
                type="text"
                placeholder="Enter a username"
                onChange={this.update("username")}
                value={this.state.username}
              />
              {usernameError}
            </div>
            <input
              type="text"
              placeholder="Enter Access Code"
              onChange={this.update("accesscode")}
              value={this.state.accesscode}
            />
            {accesscodeError}
            <div className="landing-container-form-buttons">
              <div onClick={this.createUser}>
                <i className="fas fa-door-open" />
                <button className="landing-container-form-button">
                  Join a Room
                </button>
              </div>
              <div onClick={this.goBack}>
                <i className="fas fa-arrow-circle-left" />
                <button className="landing-container-form-button">
                  Go Back
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Join;
