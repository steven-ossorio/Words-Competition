import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import Players from "./Players";
import JoinRoom from "./JoinRoom";
import Timer from "./Timer";
import PlayerScore from "./PlayerScore";
import Letters from "./Letters";
import * as Papa from "papaparse";
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
      words: [],
      wordsObj: {},
      playersScore: { mike: 3 },
      writtenWord: "",
      dictionary: {}
    };

    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.checkIfInCurrentGame = this.checkIfInCurrentGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.generateLetters = this.generateLetters.bind(this);
    this.wordCollection = this.wordCollection.bind(this);
    this.addWord = this.addWord.bind(this);
    this.update = this.update.bind(this);
    this.gameStarted = this.gameStarted.bind(this);
    this.setLetters = this.setLetters.bind(this);
    this.dictionaryParse = this.dictionaryParse.bind(this);
    this.updateData = this.updateData.bind(this);
    this.setHash = this.setHash.bind(this);
  }
  componentDidMount() {
    this.dictionaryParse();
    this.setLetters();
    this.checkIfLoggedIn();
    this.gameStarted();
    this.generateLetters();
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
      words = [];
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

  addWord() {
    let word = this.state.writtenWord;
    if (this.state.wordsObj[word] || word === "") {
      return;
    }

    let check = this.checkWord(word);

    if (this.state.dictionary.has(word) && check) {
      let gameID = this.props.match.params.id;
      let db = firebase.database();
      db.ref(`Room/${gameID}/words`).push(word);
    }

    this.setState({
      writtenWord: ""
    });
  }

  checkWord(word) {
    let letterObj = {};
    this.state.letters.split(",").forEach(letter => {
      letterObj[letter] ? (letterObj[letter] += 1) : (letterObj[letter] = 1);
    });
    for (let i = 0; i < word.length; i++) {
      let letter = word[i];
      if (!letterObj[letter] || letterObj[letter] === 0) {
        return false;
      }
    }

    return true;
  }

  update(field) {
    return e => {
      this.setState({
        [field]: e.target.value
      });
    };
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

  setLetters() {
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      let collection = snapshot.val();
      let letters = collection["letters"];
      this.setState({
        letters
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
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    let updateObj = { gameStarted: true };
    db.ref(`Room/${gameID}`).update(updateObj);
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
            <input
              onChange={this.update("writtenWord")}
              type="text"
              placeholder="Type Word Here"
              value={this.state.writtenWord}
            />
            <button onClick={this.addWord}>Click Me TO Send</button>
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
