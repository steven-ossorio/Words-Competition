import React, { Component } from "react";
import firebase from "../firebase/secretKeys";
import Players from "./Players";
import JoinRoom from "./JoinRoom";
import "./CreatedRoom.css";

class CreatedRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      playersID: {},
      loggedIn: false
    };

    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.checkIfInCurrentGame = this.checkIfInCurrentGame.bind(this);
  }
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn() {
    const loginPromise = new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          window.user = user;
          console.log("CHecked in");
          resolve(user.uid);
        } else {
          firebase
            .auth()
            .signInAnonymously()
            .then(() => {
              console.log("logged in");
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    });
    loginPromise.then(id => {
      this.checkIfInCurrentGame(id);
    });
  }

  checkIfInCurrentGame(userId) {
    console.log("checking");
    let playerObj;
    let playersKeysObj = {};
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
      if (playerObj === undefined) {
        this.props.history.push("/");
        return;
      }
      Object.keys(playerObj).forEach(id => {
        if (id === userId) {
          console.log("Logged in Became true");
          this.setState({ loggedIn: true });
        }
        newArray.push(playerObj[id]);
        playersKeysObj[id] = true;
      });

      this.setState({
        players: newArray,
        playersID: playersKeysObj
      });
    });
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <div className="created-room-container">
          <div className="created-room-container-inner">
            <h1>Waiting for players...</h1>
            <h3>Access Code: {this.props.match.params.id}</h3>
            <Players players={this.state.players} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <JoinRoom roomId={this.props.match.params.id} />
        </div>
      );
    }
  }
}
export default CreatedRoom;
