import React, { Component } from "react";
import Predict from "./contracts/Predict.json";
import getWeb3 from "./getWeb3";
import Portis from "@portis/web3";
import Web3 from "web3";

import "./App.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Button, Input, Grid, Paper, TextField } from "@material-ui/core";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    questionsCount: 0,
  };

  MetaMask = async () => {
    try {
      // Portis
      // const portis = new Portis('4233894b-0be5-4c7a-b517-553bb1a1ecee', 'maticMumbai');
      // const web3 = new Web3(portis.provider);

      // Meta-Mask
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log(web3);
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Predict.networks[networkId];
      const instance = new web3.eth.Contract(
        Predict.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log(instance.methods);
      this.setState({ web3: web3, accounts: accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  PortisWallet = async () => {
    try {
      //Portis
      const portis = new Portis(
        "4233894b-0be5-4c7a-b517-553bb1a1ecee",
        "maticMumbai"
      );
      const web3 = new Web3(portis.provider);

      // Meta-Mask
      // // Get network provider and web3 instance.
      // const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Predict.networks[networkId];
      const instance = new web3.eth.Contract(
        Predict.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log(instance.methods);
      this.setState({ web3: web3, accounts: accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  addQuestion = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods
      .addFundingBucket("Funding Bucket 2", [
        "Project 1",
        "Project 2",
        "Project 3",
      ])
      .send({
        from: accounts[0],
      })
      .then((receipt) => {
        // returns a transaction receipt
        console.log(receipt);
      });

    this.fetchQuestionsCount();

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.questions(0).call();

    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  fetchQuestion = async ({ index = 0 }) => {
    const { accounts, contract } = this.state;

    const question = await contract.methods
      .questions(index)
      .call({ from: accounts[0] }, function (_, result) {
        console.log(result);
      });
    console.log(question);
  };

  fetchQuestionsCount = async () => {
    const { accounts, contract } = this.state;

    const count = await contract.methods
      .questionsCount()
      .call({ from: accounts[0] }, function (error, result) {
        console.log(error);
        console.log(result);
      });
    console.log(count);
    this.setState({ questionsCount: count });
  };

  render() {
    if (!this.state.web3) {
      return (
        <div className="App">
          <h1>Fund Me</h1>
          <h1 className="loading">Integrate your Wallet with Portis:</h1>
          <span>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.PortisWallet}
            >
              Connect to Portis Wallet
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.MetaMask}
            >
              Connect to MetaMask Wallet
            </Button>
          </span>
        </div>
      );
    }
    return (
      <div className="App">
        <Nav />
        <h3>Welcome {this.state.accounts[0]}</h3>
        <Button variant="contained" color="primary" onClick={this.addQuestion}>
          Add a Funding Bucket
        </Button>
        <div className="wrapper">
          <div className="box">
            Funding Bucket
            <div className="container">
              <div className="projects">
                <Button variant="contained" color="secondary">
                  Project 1
                </Button>
              </div>
              <div className="projects">
                <Button variant="contained" color="secondary">
                  Project 2
                </Button>
              </div>
              <div className="projects">
                <Button variant="contained" color="secondary">
                  Project 3
                </Button>
              </div>
            </div>
            {/* <span className="input">
              <TextField label="Project name"></TextField>
              <Button variant="contained" color="primary" size="small">
                Enter
              </Button>
            </span> */}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
