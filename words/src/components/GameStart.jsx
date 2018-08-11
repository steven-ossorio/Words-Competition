import React from "react";
import Timer from "./Timer";
import Letters from "./Letters";
import Words from "./Words";
import PlayerScore from "./PlayerScore";

export default props => {
  return (
    <div className="created-room-container">
      <Timer />
      <div className="game-start-container">
        <Letters gameID={props.gameID} />
        <Words gameID={props.gameID} dictionary={props.dictionary} />
        <PlayerScore
          players={props.players}
          playersScore={props.playersScore}
        />
      </div>
    </div>
  );
};
