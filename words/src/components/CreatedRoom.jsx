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
  componentDidMount(props) {
    let playerObj;
    let gameID = this.props.match.params.id;
    let db = firebase.database();
    // db.ref(`Room/${gameID}`).on("value", snapshot => {
    //   this.setState({
    //     players: []
    //   })
    //   snapshot.forEach(snap => {
    //     playerObj = snap.val();
    //   })

    //   let newArray = [];
    //   Object.keys(playerObj).forEach(id => {
    //     newArray.push(playerObj[id])
    //   })

    //   this.setState({
    //     players: newArray
    //   })

    // });

    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     window.user = user;
    //     console.log(user.isAnonymous);
    //     console.log("User:", user.uid);
    //   } else {
    //     firebase
    //       .auth()
    //       .signInAnonymously()
    //       .then(() => {
    //         console.log("logged in");
    //       })
    //       .catch(err => {
    //         console.log(err);
    //       });
    //   }
    // });
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
