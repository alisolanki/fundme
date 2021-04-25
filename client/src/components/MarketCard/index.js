import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class MarketCard extends Component {
  render() {
    const market = this.props.market;
    return (
      <>
        <Link to={`/markets/${market.id}`}>
          <div key={market.id}>Market Card {market.id}</div>
        </Link>
      </>
    );
  }
}
