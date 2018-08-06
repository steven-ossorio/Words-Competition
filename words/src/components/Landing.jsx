import React, { Component } from 'react'

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      create: false,
      back: false
    }
  }

  updatecCreate() {
    this.setState({ create: true })
  }
  render() {
    if (!this.state.create) {
      return (
        <div>
          <h1>Welcome to Word</h1>
          <button onClick={this.updatecCreate.bind(this)}>Create Game</button>
        </div>
      )
    } else {
      return (
        <div>Again</div>
      )
    }
  }
}

export default Landing;