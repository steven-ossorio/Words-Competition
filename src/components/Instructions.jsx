import React, { Component } from "react";
import "./Instructions.css";

class Instructions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };

    this.updateModal = this.updateModal.bind(this);
  }

  updateModal() {
    let modalOpen = !this.state.modalOpen;
    this.setState({ modalOpen });
  }
  render() {
    if (this.state.modalOpen) {
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
                Basic Description
              </h1>
              <p className="open-modal-container-content-description">
                What this application is about.
              </p>
              <img
                className="open-modal-container-content-img"
                src={require("../img/background.png")}
                alt=""
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div onClick={this.updateModal}>Instructions</div>
        </div>
      );
    }
  }
}

export default Instructions;
