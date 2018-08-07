import React from "react";

export default props => {
  let playerList = props.players.map((player, i) => {
    return <h2 key={i}>{player}</h2>;
  });
  return <div>{playerList}</div>;
};
