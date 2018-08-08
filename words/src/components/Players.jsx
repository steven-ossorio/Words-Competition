import React from "react";
import "./Players.css";

export default props => {
  let playerList = props.players.reverse();
  playerList = props.players.map((player, i) => {
    return (
      <li className="players-container-list" key={i}>
        <div>{i + 1}</div>
        <div>{player}</div>
      </li>
    );
  });
  return <ul className="players-container">{playerList}</ul>;
};
