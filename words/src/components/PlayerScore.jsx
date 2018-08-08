import React from "react";
import "./PlayersScore.css";

export default props => {
  let playerList = props.players.reverse();
  console.log(props);
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
  );
  // <ul className="players-container">scoreBoard {playerList}</ul>)
};
