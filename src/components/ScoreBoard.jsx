import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import "./ScoreBoard.css";

class ScoreBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scoreBoard: {},
      time: "",
      isMounted: false
    };

    this.updateScoreBoard = this.updateScoreBoard.bind(this);
  }

  componentDidMount() {
    this.updateScoreBoard();
  }

  componentWillUnmount() {
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).off("value");
  }

  updateScoreBoard() {
    let scoreBoard = {};
    let gameID = this.props.gameID;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      let collection = snapshot.val();
      let playersScore = collection["scoreBoard"];
      if (playersScore === undefined || playersScore === null) {
        return;
      }
      Object.keys(playersScore).forEach(username => {
        scoreBoard[username] = playersScore[username];
      });

      this.setState({ scoreBoard });
    });
  }

  render() {
    let playerList = this.props.players;
    playerList = playerList.map((player, i) => {
      let score = this.state.scoreBoard[player];
      let backgroundColor = this.props.backgroundColors[i];
      return (
        <tr
          style={{ backgroundColor: `${backgroundColor}` }}
          className="players-container-list"
          key={i}
        >
          <td>{i + 1}</td>
          <td>{player}</td>
          <td>{score}</td>
        </tr>
      );
    });
    return (
      <div className="players-score-container">
        <h1>Score Board</h1>
        <table>
          <tbody>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
            {playerList}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ScoreBoard;
