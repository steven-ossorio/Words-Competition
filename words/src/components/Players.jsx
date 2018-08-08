import React from "react";

export default props => {
  let playerList = props.players.map((player, i) => {
    return (
      <li key={i}>
        <div>{i + 1}</div>
        <div>{player}</div>
      </li>
    );
  });
  return <ul>{playerList}</ul>;
};
