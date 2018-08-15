import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import LettersList from "./LettersList";

class Letters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      letters: "",
      isMounted: false
    };

    this.setLetters = this.setLetters.bind(this);
    this.generateLetters = this.generateLetters.bind(this);
  }

  componentDidMount() {
    this.setState({ isMounted: true }, () => {
      if (this.state.isMounted) {
        this.generateLetters();
        this.setLetters();
      }
    });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  setLetters() {
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
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`)
      .child("letters")
      .set(`${letters}`);
  }

  render() {
    return (
      <div>
        <LettersList letters={this.state.letters} />
      </div>
    );
  }
}

export default Letters;
