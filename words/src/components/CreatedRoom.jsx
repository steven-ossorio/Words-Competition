import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import Players from "./Players";

class CreatedRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: []
    };
  }
  componentDidMount() {
    let playerObj;
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    db.ref(`Room/${gameID}`).on("value", snapshot => {
      this.setState({
        players: []
      });
      snapshot.forEach(snap => {
        playerObj = snap.val();
      });

      let newArray = [];
      Object.keys(playerObj).forEach(id => {
        newArray.push(playerObj[id]);
      });

      this.setState({
        players: newArray
      });
    });
  }

  render() {
    console.log(this.state.players);
    return (
      <div>
        This is a created Room
        <Players players={this.state.players} />
      </div>
    );
  }
}

export default CreatedRoom;
