import React from "react";
import "./PlayersScore.css";

export default props => {
  let playerList = props.players.reverse();
  playerList = playerList.map((player, i) => {
    let score = props.playersScore[player];
    return (
      <tr className="players-container-list" key={i}>
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
};
