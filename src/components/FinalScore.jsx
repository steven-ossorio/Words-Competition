import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import { Link } from "react-router-dom";
import "./FinalScore.css";

class FinalScore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedKeys: [],
      sortedScore: []
    };

    this.finalScore = this.finalScore.bind(this);
  }

  componentDidMount() {
    this.finalScore();
  }

  finalScore() {
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}/scoreBoard`).once("value", snapshot => {
      let scoreObj = snapshot.val();
      if (scoreObj === null || scoreObj === undefined) {
        return;
      }
      let sortedKeys = Object.keys(scoreObj).sort((a, b) => {
        return scoreObj[b] - scoreObj[a];
      });

      let sortedScore = [];
      sortedKeys.forEach(key => {
        sortedScore.push(scoreObj[key]);
      });

      this.setState({ sortedKeys, sortedScore });
    });
  }

  render() {
    let scoreBoard;
    if (this.state.sortedKeys.length > 0) {
      scoreBoard = this.state.sortedKeys.map((key, i) => {
        return (
          <li className="list-item">
            <span className="list-item-username">{key}</span>
            <span className="list-item-score">{this.state.sortedScore[i]}</span>
          </li>
        );
      });
    }
    return (
      <div className="final-score-container">
        <h1 className="final-score-container-title">Final Score</h1>
        <ul className="final-score-container-list-container">{scoreBoard}</ul>
        <div className="final-score-container-buttons">
          <div className="final-score-container-buttons-button-container">
            <Link to={"/create-room"}>
              <button className="button">Create room</button>
            </Link>
          </div>
          <div className="final-score-container-buttons-button-container">
            <Link to={"/"}>
              <button className="button">Home page</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default FinalScore;