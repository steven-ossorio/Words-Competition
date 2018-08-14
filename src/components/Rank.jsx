import React, { Component } from "react";
import firebase from "../firebase/secretKeys";

export default class Rank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highestScores: []
    };

    this.fetchHighScore = this.fetchHighScore.bind(this);
  }

  componentDidMount() {
    this.fetchHighScore();
  }

  fetchHighScore() {
    let db = firebase.database();
    db.ref("Ranking").on("value", snapshot => {
      console.log(snapshot.val());
    });
  }
  render() {
    return <div>THIS IS FOR RANKING</div>;
  }
}
