import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import Players from "./Players";
import * as Papa from "papaparse";
import "./WaitingRoom.css";
import { PacmanLoader } from "react-spinners";
import GameStart from "./GameStart";

class CreatedRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      playersID: {},
      loggedIn: false,
      startGame: false,
      playersScore: {},
      dictionary: {},
      backgroundColors: [],
      colors: [],
      roomCreator: false,
      isMounted: false
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
    this.removePlayer = this.removePlayer.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.setState({ isMounted: true }, () => {
      if (this.state.isMounted) {
        this.dictionaryParse();
        this.checkIfLoggedIn();
        this.gameStarted();
        this.updateCurrentPlayers();
      }
    });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).off("value");
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
    if (this.state.isMounted) {
      this.setState({ dictionary: data });
      this.setHash();
    }
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
      if (collection === null) {
        return;
      }
      if (
        collection["gameStarted"] === null ||
        collection["gameStarted"] === undefined
      ) {
        return;
      }
      let startGame = collection["gameStarted"];
      if (this.state.isMounted) {
        this.setState({
          startGame
        });
      }
    });
  }

  removePlayer(e) {
    e.preventDefault();
    const loginPromise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.user = user;
          resolve(user.uid);
          if (this.state.signInAnonymously) {
            this.setState({ loggedIn: true });
          }
        } else {
          firebase
            .auth()
            .signInAnonymously()
            .then(() => {
              this.setState({ loggedIn: true });
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    });
    loginPromise.then(id => {
      let gameID = this.props.match.params.id;
      let db = firebase.database();

      db.ref(`Room/${gameID}/players/${id}`).remove();
      this.props.history.push({
        pathname: "/"
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
              if (this.state.isMounted) {
                this.setState({ loggedIn: true });
              }
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
      let collection = snapshot.val();
      if (
        collection["players"] === null ||
        collection["players"] === undefined
      ) {
        return;
      }
      let players = collection["players"];

      Object.keys(players).forEach(key => {
        playersKeysObj[key] = true;
      });

      if (this.state.isMounted) {
        this.setState({ playersID: playersKeysObj });
      }
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
      let backgroundColors = this.state.backgroundColors;
      let colors = this.state.colors;

      if (players === undefined || players === null) {
        this.props.history.push("/");
        return;
      }

      if (!this.state.playersID[userId] || !this.state.loggedIn) {
        this.props.history.push(`/join-room/${gameID}`);
        return;
      }

      Object.keys(players).forEach(id => {
        newArray.unshift(players[id]);
      });

      for (let i = 0; i < newArray.length; i++) {
        if (
          this.state.backgroundColors[i] === undefined &&
          this.state.colors[i] === undefined
        ) {
          let backgroundColor =
            "#" + Math.floor(Math.random() * 16777215).toString(16);
          backgroundColors.push(backgroundColor);

          let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
          colors.push(color);
        }
      }

      let roomCreator;
      if (collection["creator"] === userId) {
        roomCreator = true;
      }
      if (this.state.isMounted) {
        this.setState({
          players: newArray,
          colors,
          backgroundColors,
          roomCreator
        });
      }
    });
  }

  startGame(e) {
    e.preventDefault();
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    let updateObj = { gameStarted: true };
    db.ref(`Room/${gameID}`).update(updateObj);
    this.setState({ startGame: true });
  }

  goBack(e) {
    e.preventDefault();
    this.props.history.push({
      pathname: "/"
    });
  }

  render() {
    if (this.state.startGame) {
      return (
        <div className="created-room-container">
          <GameStart
            gameID={this.props.match.params.id}
            dictionary={this.state.dictionary}
            players={this.state.players}
            colors={this.state.colors}
            backgroundColors={this.state.backgroundColors}
            playersScore={this.state.playersScore}
            history={this.props.history}
          />
        </div>
      );
    } else if (this.state.loggedIn) {
      let startButton = "";
      if (this.state.roomCreator) {
        startButton = (
          <button
            className="landing-container-form-button"
            onClick={this.startGame}
          >
            Start Game
          </button>
        );
      }
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
              <div className="landing-container-form-buttons">
                {startButton}
                <div onClick={this.removePlayer}>
                  <button className="landing-container-form-button">
                    Leave Room
                  </button>
                </div>
              </div>
              <Players
                colors={this.state.colors}
                backgroundColors={this.state.backgroundColors}
                players={this.state.players}
              />
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
