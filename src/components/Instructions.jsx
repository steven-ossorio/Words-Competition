import React, { Component } from "react";
import "./Instructions.css";

class Instructions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      currentIndex: 0
    };

    this.updateModal = this.updateModal.bind(this);
    this.panelForward = this.panelForward.bind(this);
    this.panelBack = this.panelBack.bind(this);
  }

  panelForward() {
    let currentIndex;
    if (this.state.currentIndex === 4) {
      currentIndex = 0;
    } else {
      currentIndex = this.state.currentIndex;
      currentIndex += 1;
    }
    this.setState({ currentIndex });
  }

  panelBack() {
    let currentIndex;
    if (this.state.currentIndex === 0) {
      currentIndex = 4;
    } else {
      currentIndex = this.state.currentIndex;
      currentIndex -= 1;
    }
    this.setState({ currentIndex });
  }

  updateModal() {
    let modalOpen = !this.state.modalOpen;
    this.setState({ modalOpen });
  }
  render() {
    if (this.state.modalOpen) {
      let one = [
        require("../img/landing-page.png"),
        require("../img/create-page.png"),
        require("../img/waiting-page.png"),
        require("../img/game-page2.png"),
        require("../img/final-page.png")
      ];
      let img = one[this.state.currentIndex];
      return (
        <div className="open-modal-container">
          <div className="open-modal-container-background">
            <div className="open-modal-container-content">
              <span
                className="open-modal-container-content-close-modal"
                onClick={this.updateModal}
              >
                X
              </span>
              <h1 className="open-modal-container-content-header">
                Welcome! to <span>Words</span>
              </h1>
              <p className="open-modal-container-content-description">
                The rules are simple. Go solo or grab a friend, compete with
                them to see who can create the most words from a list of
                letters. Think you got the skills? let the game begin!
              </p>
              <div className="arrows">
                <i onClick={this.panelBack} className="fas fa-arrow-left" />
                <i onClick={this.panelForward} className="fas fa-arrow-right" />
              </div>
              <img
                className="open-modal-container-content-img"
                src={img}
                alt=""
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="close-modal" onClick={this.updateModal}>
            Instructions
          </div>
        </div>
      );
    }
  }
}

export default Instructions;
