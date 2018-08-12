import React from "react";
import Timer from "./Timer";
import Letters from "./Letters";
import Words from "./Words";
import ScoreBoard from "./ScoreBoard";
import "./GameStart.css";

export default props => {
  return (
    <div className="created-room-container">
      <Timer gameID={props.gameID} />
      <div className="game-start-container">
        <Letters gameID={props.gameID} />
        <Words gameID={props.gameID} dictionary={props.dictionary} />
        <ScoreBoard
          gameID={props.gameID}
          players={props.players}
          playersScore={props.playersScore}
        />
      </div>
    </div>
  );
};
