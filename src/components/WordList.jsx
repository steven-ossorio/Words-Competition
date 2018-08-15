import React from "react";
import "./WordList.css";

export default props => {
  let words = props.words.map((word, i) => {
    return <li key={i}>{word}</li>;
  });
  return (
    <div className="words-container">
      <ul className="words-container-list">{words}</ul>
    </div>
  );
};
