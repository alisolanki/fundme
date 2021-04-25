import React, { Component } from "react";
import Intro from "../Intro";
import MarketGrid from "../MarketGrid";

export default class HomePage extends Component {
  render() {
    return (
      <div className="home">
        <Intro />
        <h1>Markets:</h1>
        <MarketGrid />
      </div>
    );
  }
}
