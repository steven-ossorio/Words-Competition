import React from "react";
import "./Letters.css";

export default props => {
  let letters = props.letters.map((letter, i) => {
    return (
      <div className="letters" key={i}>
        {letter}
      </div>
    );
  });
  return (
    <div className="letters-container">
      <h1>Letters</h1>
      <div className="letters-container-inner">{letters}</div>
    </div>
  );
};
