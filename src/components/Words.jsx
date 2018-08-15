import React, { Component } from "react";
import WordList from "./WordList";
import firebase from "../firebase/secretKeys";

class Words extends Component {
  constructor(props) {
    super(props);

    this.state = {
      words: [],
      wordsObj: {},
      writtenWord: "",
      dictionary: {},
      word: "",
      letters: "",
      time: "",
      errors: "",
      isMounted: false
    };

    this.wordCollection = this.wordCollection.bind(this);
    this.checkWord = this.checkWord.bind(this);
    this.addWord = this.addWord.bind(this);
    this.update = this.update.bind(this);
    this.retreiveLetters = this.retreiveLetters.bind(this);
    this.addAPoint = this.addAPoint.bind(this);
  }

  componentDidMount() {
    this.setState({ isMounted: true }, () => {
      if (this.state.isMounted) {
        this.wordCollection();
        this.retreiveLetters();
        this.timer();
      }
    });
  }

  componentWillMount() {
    if (this.state.time === 0) {
      this.props.history.push(`/final-score/${this.props.gameID}`);
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  retreiveLetters() {
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      let collection = snapshot.val();
      let letters = collection["letters"];
      this.setState({
        letters
      });
    });
  }

  timer() {
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      let collection = snapshot.val();
      let time = collection["time"];
      this.setState({
        time
      });

      if (this.state.time === 0) {
        let pause = setInterval(() => {
          this.props.history.push(`/final-score/${this.props.gameID}`);
          clearInterval(pause);
        }, 1000);
      }
    });
  }

  wordCollection() {
    let words = [];
    let wordsObj = {};
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      words = [];
      let collection = snapshot.val();
      let wordsCollection = collection["words"];

      if (wordsCollection) {
        Object.keys(wordsCollection).forEach(wordKey => {
          words.unshift(wordsCollection[wordKey]);
          wordsObj[wordsCollection[wordKey]] = true;
        });
      }

      this.setState({
        words,
        wordsObj
      });
    });
  }

  addAPoint() {
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
      let db = firebase.database();
      let playerRef = db.ref(`Room/${this.props.gameID}/players/${id}`);
      playerRef.once("value", snapshot => {
        let username = snapshot.val();
        let scoreRef = db.ref(
          `Room/${this.props.gameID}/scoreBoard/${username}`
        );
        scoreRef.once("value", snapshot => {
          let score = snapshot.val();
          let update = { [username]: score + 1 };
          db.ref(`Room/${this.props.gameID}/scoreBoard/`).update(update);
        });
      });
    });
  }

  addWord(e) {
    if (e.charCode === 13) {
      let word = this.state.word.toLowerCase();
      if (word === "") {
        this.setState({ errors: "Can't be blank", word: "" });
        return;
      } else if (this.state.wordsObj[word]) {
        this.setState({ errors: "Word already exists", word: "" });
        return;
      }

      let check = this.checkWord(word);

      if (!check) {
        this.setState({
          errors: 'Dictionary says: "Not a real word"',
          word: ""
        });
        return;
      }

      if (this.props.dictionary.has(word) && check) {
        let gameID = this.props.gameID;
        let db = firebase.database();
        db.ref(`Room/${gameID}/words`).push(word);
        this.addAPoint();

        this.setState({
          word: "",
          errors: ""
        });
      } else {
        this.setState({ errors: 'Dictionary says: "Not a real word"' });
      }
    }
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

      letterObj[letter] -= 1;
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

  render() {
    let inputProps = {};
    if (this.state.time === 0) {
      inputProps.disabled = true;
    }
    let errors = "";
    if (this.state.errors.length > 0) {
      errors = <div className="create-errors">{this.state.errors}</div>;
    }

    return (
      <div>
        <div className="word-input-box">
          <h1 className="words-container-header">Words</h1>

          <input
            {...inputProps}
            onKeyPress={this.addWord}
            onChange={this.update("word")}
            type="text"
            placeholder="Type Word Here"
            value={this.state.word}
          />
          {errors}
          <WordList words={this.state.words} />
        </div>
      </div>
    );
  }
}

export default Words;
