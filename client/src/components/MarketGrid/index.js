import React, { Component } from "react";
import { Link } from "react-router-dom";
import MarketCard from "../MarketCard";

export default class MarketGrid extends Component {
  render() {
    let markets = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    return (
      <div className="market-grid">
        {markets.map((market) => {
          return (
            <>
              <MarketCard market={market} />
            </>
          );
        })}
      </div>
    );
  }
}
