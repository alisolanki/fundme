import React, { useState, createContext } from "react";

export const WalletContext = createContext();

export const WalletProvider = (props) => {
  const [options, setOptions] = useState([
    {
      web3: null,
      accounts: null,
      contract: null,
      questionsCount: 1,
    },
  ]);
  return (
    <>
      <WalletContext.Provider value={"helo"}>
        {props.children}
      </WalletContext.Provider>
    </>
  );
};
