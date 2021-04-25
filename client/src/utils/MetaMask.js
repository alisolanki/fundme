import getWeb3 from "../getWeb3";
import Predict from "../contracts/Predict.json";

const MetaMask = async () => {
  try {
    // Portis
    // const portis = new Portis('4233894b-0be5-4c7a-b517-553bb1a1ecee', 'maticMumbai');
    // const web3 = new Web3(portis.provider);

    // Meta-Mask
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

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

export default MetaMask;
