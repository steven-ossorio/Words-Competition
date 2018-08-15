import React from "react";
import "./Players.css";

export default props => {
  let playerList = props.players.reverse();
  playerList = props.players.map((player, i) => {
    let color = props.colors[i];
    let backgroundColor = props.backgroundColors[i];
    return (
      <li
        style={{ backgroundColor: `${backgroundColor}`, color: `${color}` }}
        className="players-container-list"
        key={i}
      >
        <div className="players-container-list-number">{i + 1}</div>
        <div className="players-container-list-username">{player}</div>
      </li>
    );
  });
  return <ul className="players-container">{playerList}</ul>;
};
