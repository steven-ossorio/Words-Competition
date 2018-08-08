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
      letters: "",
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
      wordsObj: {},
      playersScore: { mike: 3 }
    };

    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.checkIfInCurrentGame = this.checkIfInCurrentGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.generateLetters = this.generateLetters.bind(this);
    this.wordCollection = this.wordCollection.bind(this);
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
      this.wordCollection();
    });
  }

  wordCollection() {
    let words = [];
    let wordsObj = {};
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      this.setState({
        words: []
      });

      let collection = snapshot.val();
      let wordsCollection = collection["words"];

      if (wordsCollection) {
        Object.keys(wordsCollection).forEach(wordKey => {
          words.push(wordsCollection[wordKey]);
          wordsObj[wordsCollection[wordKey]] = true;
        });
      }

      this.setState({
        words,
        wordsObj
      });
    });
  }

  checkIfInCurrentGame(userId) {
    let playersKeysObj = {};
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      this.setState({
        players: []
      });

      let collection = snapshot.val();
      let players = collection["players"];
      let newArray = [];

      if (players === undefined) {
        this.props.history.push("/");
        return;
      }
      Object.keys(players).forEach(id => {
        if (id === userId) {
          this.setState({ loggedIn: true });
        }
        newArray.push(players[id]);
        playersKeysObj[id] = true;
      });

      this.setState({
        players: newArray,
        playersID: playersKeysObj
      });
    });
  }

  generateLetters() {
    let letters = [];
    let vowels = ["a", "e", "i", "o", "u"];
    let constant = [
      "b",
      "c",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "m",
      "p",
      "q",
      "r",
      "s",
      "t",
      "v",
      "w",
      "x",
      "y",
      "z"
    ];

    let option = ["vowels", "constant"];
    for (let i = 0; i < 9; i++) {
      let selected = option[Math.floor(Math.random() * option.length)];
      if (selected === "vowels") {
        letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
      } else {
        letters.push(constant[Math.floor(Math.random() * constant.length)]);
      }
    }

    this.setState({ letters });
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`)
      .child("letters")
      .set(`${letters}`);
  }

  startGame() {
    this.generateLetters();
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
          <div className="input-box">
            <input type="text" placeholder="Type Word Here" />
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
