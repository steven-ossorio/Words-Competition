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
      letters: ""
    };

    this.wordCollection = this.wordCollection.bind(this);
    this.checkWord = this.checkWord.bind(this);
    this.addWord = this.addWord.bind(this);
    this.update = this.update.bind(this);
    this.retreiveLetters = this.retreiveLetters.bind(this);
  }

  componentDidMount() {
    this.wordCollection();
    this.retreiveLetters();
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
    let word = this.state.word;
    if (this.state.wordsObj[word] || word === "") {
      return;
    }

    let check = this.checkWord(word);

    if (this.props.dictionary.has(word) && check) {
      let gameID = this.props.gameID;
      let db = firebase.database();
      db.ref(`Room/${gameID}/words`).push(word);
    }

    this.setState({
      word: ""
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

  render() {
    return (
      <div>
        <WordList words={this.state.words} />
        <div className="input-box">
          <input
            onChange={this.update("word")}
            type="text"
            placeholder="Type Word Here"
            value={this.state.word}
          />
          <button onClick={this.addWord}>Click Me TO Send</button>
        </div>
      </div>
    );
  }
}

export default Words;
