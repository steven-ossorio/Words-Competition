import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import Players from "./Players";
import JoinRoom from "./JoinRoom";
import Timer from "./Timer";
import PlayerScore from "./PlayerScore";
import Letters from "./Letters";
import WordList from "./WordList";
import { Link } from "react-router-dom";
import "./CreatedRoom.css";

class CreatedRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      playersID: {},
      loggedIn: false,
      startGame: false,
      letters: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
      words: [
        "Cow",
        "Book",
        "Corner",
        "Milk",
        "Justify",
        "jimmy",
        "kitty",
        "footer"
      ],
      playersScore: { mike: 3 }
    };

    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.checkIfInCurrentGame = this.checkIfInCurrentGame.bind(this);
    this.startGame = this.startGame.bind(this);
  }
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn() {
    const loginPromise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.user = user;
          console.log("CHecked in");
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
      this.checkIfInCurrentGame(id);
    });
  }

  checkIfInCurrentGame(userId) {
    let playerObj;
    let playersKeysObj = {};
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      this.setState({
        players: []
      });
      snapshot.forEach(snap => {
        playerObj = snap.val();
      });

      let newArray = [];
      if (playerObj === undefined) {
        this.props.history.push("/");
        return;
      }
      Object.keys(playerObj).forEach(id => {
        if (id === userId) {
          this.setState({ loggedIn: true });
        }
        newArray.push(playerObj[id]);
        playersKeysObj[id] = true;
      });

      this.setState({
        players: newArray,
        playersID: playersKeysObj
      });
    });
  }

  startGame() {
    this.setState({ startGame: true });
  }

  render() {
    if (this.state.startGame) {
      return (
        <div className="created-room-container">
          <Timer />
          <div className="game-start-container">
            <Letters letters={this.state.letters} />
            <WordList words={this.state.words} />
            <PlayerScore
              players={this.state.players}
              playersScore={this.state.playersScore}
            />
          </div>
        </div>
      );
    } else if (this.state.loggedIn) {
      return (
        <div className="created-room-container">
          <div className="created-room-container-inner">
            <h1 className="created-room-container-inner-header">
              Waiting for players...
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
      );
    } else {
      return (
        <div>
          <JoinRoom roomId={this.props.match.params.id} />
        </div>
      );
    }
  }
}
export default CreatedRoom;
