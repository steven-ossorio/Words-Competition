import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase/secretKeys";
import * as Papa from "papaparse";
import "./Landing.css";

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      create: false,
      joinRoom: false,
      back: false,
      roomId: "",
      username: "",
      currentUser: "",
      userId: "",
      dictionary: []
    };

    this.userId = "";
    this.currentUserUid = "";
    this.update = this.update.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateCreate = this.updateCreate.bind(this);
    this.updateJoinRoom = this.updateJoinRoom.bind(this);
    this.dictionaryParse = this.dictionaryParse.bind(this);
    this.updateData = this.updateData.bind(this);
    this.setHash = this.setHash.bind(this);
  }

  componentDidMount() {
    this.dictionaryParse();
    let db = firebase.database();
    let roomRefKey = db.ref("Room").push().key;

    this.setState({
      roomId: roomRefKey
    });
  }

  dictionaryParse() {
    // let dictionary = [];
    // let file = require("../dictionary/aWords.csv");
    // let data = Papa.parse(file, {
    //   header: true,
    //   download: true,
    //   skipEmptyLines: true,
    //   complete: function(results) {
    //     return results.data;
    //   }
    // });

    let csvFilePath = require("../dictionary/dictionary.csv");
    Papa.parse(csvFilePath, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: this.updateData
    });
  }

  updateData(results) {
    let data = results.data;

    this.setState({ dictionary: data });
    this.setHash();
  }

  setHash() {
    let dictionary = this.state.dictionary;
    let set = new Set();
    for (let i = 0; i < dictionary.length; i++) {
      set.add(dictionary[i]["aa"]);
    }

    this.setState({ dictionary: set });
  }

  updateCreate(e) {
    e.preventDefault();
    let create = !this.state.create;
    this.setState({ create });
  }

  updateJoinRoom(e) {
    e.preventDefault();
    let joinRoom = !this.state.joinRoom;
    this.setState({ joinRoom });
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
    if (!this.state.create && !this.state.joinRoom) {
      return (
        <div className="landing">
          <div className="landing-container">
            <h1 className="landing-container-header">Welcome to Word</h1>
            <div className="landing-container-buttons">
              <button
                className="landing-container-button"
                onClick={this.updateCreate}
              >
                Create Game
              </button>
              <button
                className="landing-container-button"
                onClick={this.updateJoinRoom}
              >
                Join a room
              </button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.joinRoom && !this.state.create) {
      return (
        <div className="landing">
          <div className="landing-container join-room">
            <h1 className="landing-container-header">Welcome to Word</h1>
            <form className="landing-container-form">
              <input
                type="text"
                placeholder="Enter a username"
                onChange={this.update("username")}
              />
              <input
                type="text"
                placeholder="Enter Access Code"
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
                    onClick={this.updateJoinRoom}
                  >
                    Go Back
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      );
    } else if (this.state.create && !this.state.joinRoom) {
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
                    onClick={this.updateCreate}
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
}

export default Landing;
