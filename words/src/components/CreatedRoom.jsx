import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import Players from "./Players";
import Timer from "./Timer";
import PlayerScore from "./PlayerScore";
import Letters from "./Letters";
import * as Papa from "papaparse";
import { Link } from "react-router-dom";
import "./CreatedRoom.css";
import Words from "./Words";
import { PacmanLoader } from "react-spinners";

class CreatedRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      playersID: {},
      loggedIn: false,
      startGame: false,
      playersScore: { mike: 3 },
      dictionary: {}
    };

    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.checkIfInCurrentGame = this.checkIfInCurrentGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.update = this.update.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.dictionaryParse = this.dictionaryParse.bind(this);
    this.updateData = this.updateData.bind(this);
    this.setHash = this.setHash.bind(this);
    this.updateCurrentPlayers = this.updateCurrentPlayers.bind(this);
  }
  componentDidMount() {
    this.dictionaryParse();
    this.checkIfLoggedIn();
    this.gameStarted();
    this.updateCurrentPlayers();
  }

  componentWillUpdate() {
    if (this.state.loggedIn) {
      return true;
    }
  }

  dictionaryParse() {
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

  gameStarted() {
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      let collection = snapshot.val();
      let startGame = collection["gameStarted"];

      this.setState({
        startGame
      });
    });
  }

  checkIfLoggedIn() {
    const loginPromise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.user = user;
          resolve(user.uid);
          this.setState({ loggedIn: true });
        } else {
          firebase
            .auth()
            .signInAnonymously()
            .then(() => {
              console.log("logged in");
              this.setState({ loggedIn: true });
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    });
    loginPromise.then(id => {
      this.checkIfInCurrentGame(id);
    });
  }

  update(field) {
    return e => {
      this.setState({
        [field]: e.target.value
      });
    };
  }

  updateCurrentPlayers() {
    let playersKeysObj = {};
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      this.setState({
        playersID: {}
      });

      let collection = snapshot.val();
      let players = collection["players"];

      Object.keys(players).forEach(key => {
        playersKeysObj[key] = true;
      });
      this.setState({ playersID: playersKeysObj });
    });
  }

  checkIfInCurrentGame(userId) {
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      this.setState({
        players: []
      });

      let collection = snapshot.val();
      let players = collection["players"];
      let newArray = [];

      if (!this.state.playersID[userId] || !this.state.loggedIn) {
        this.props.history.push(`/join-room/${gameID}`);
        return;
      }
      Object.keys(players).forEach(id => {
        newArray.push(players[id]);
      });

      this.setState({
        players: newArray
      });
    });
  }

  startGame() {
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    let updateObj = { gameStarted: true };
    db.ref(`Room/${gameID}`).update(updateObj);
    this.setState({ startGame: true });
  }

  render() {
    console.log(this.state.loggedIn);
    if (this.state.startGame) {
      return (
        <div className="created-room-container">
          <Timer />
          <div className="game-start-container">
            <Letters gameID={this.props.match.params.id} />
            <Words
              gameID={this.props.match.params.id}
              dictionary={this.state.dictionary}
            />
            <PlayerScore
              players={this.state.players}
              playersScore={this.state.playersScore}
            />
          </div>
        </div>
      );
    } else if (this.state.loggedIn) {
      return (
        <div className="created-room">
          <div className="created-room-container">
            <div className="created-room-container-inner">
              <h1 className="created-room-container-inner-header">
                Waiting for players{" "}
                <span>
                  <PacmanLoader color={"#123abc"} />
                </span>
              </h1>
              <h3 className="created-room-container-inner-header-sub">
                <span>Access Code:</span> {this.props.match.params.id}
              </h3>
              <Players players={this.state.players} />
              <div className="landing-container-form-buttons">
                <button
                  className="landing-container-form-button"
                  onClick={this.startGame}
                >
                  Start Game
                </button>
                <Link to="/" replace>
                  <button className="landing-container-form-button">
                    Go Back
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>{/* <Join accesscode={this.props.match.params.id} /> */}</div>
      );
    }
  }
}
export default CreatedRoom;
