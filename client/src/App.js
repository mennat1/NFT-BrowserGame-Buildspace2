import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import { ethers } from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';



// 1) If user has has not connected to your app - Show Connect To Wallet Button
// 2) If user has connected to your app AND does not have a character NFT - Show SelectCharacter Component
// 3) If user has connected to your app AND does have a character NFT - Show Arena Component. The Arena is where users will be able to attack our boss!

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Render Methods
  const renderContent = () => {
     if (isLoading) {
      return <LoadingIndicator />;
    }
    console.log("Hello from renderContent");
     /*
    * Scenario #1
    */
    if (!currentAccount) {
      console.log("Scenario 1");
      return (
        <div className="connect-wallet-container">
          <img
              // src="https://i.ibb.co/mBws2GW/ghaby.gif"
              src="https://gateway.pinata.cloud/ipfs/QmU8tJMKQ2wWn5kvKWcnhBNwdm1NLUTbgdu6qwugbQxBZd"
              alt="Ghaby Menno Feeh Gif"
            />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
      * Scenario #2
      */
    } else if (currentAccount && !characterNFT) {
      console.log("Scenario 2");
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }else if (currentAccount && characterNFT) {
      console.log("Scenarion 3");
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    console.log("Hello from connectWalletAction");
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // When component returns and renders
  useEffect( () => {
    console.log("Hi from useHook #1 -- App");
  
    // We are declaring the function to run inside our hook. Looks sort of weird, right? But we have to do this because useEffect + async don't play well together. By declaring our async function like this, we can get around that.
    const fetchNFTMetadata = async () => {
      console.log("Hello from fetchNFTMetadata");
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      console.log("checkIfUserHasNFT txn:", txn);
      if (txn.name) {
        console.log('User has character NFT');
        console.log(characterNFT);
        setCharacterNFT(transformCharacterData(txn));
        console.log("CHARACTERNFT: ",characterNFT);
      } else {
        console.log('No character NFT found');
      }
    };
    /*
     * Once we are done with all the fetching, set loading state to false
     */
    setIsLoading(false);

    /*
    * We only want to run this, if we have a connected wallet
    */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  // Anytime the value of currentAccount changes, this useffect will get fired! For example, when currentAccount changes from null to a new wallet address, this logic will run.
  }, [currentAccount]);

  useEffect(() => {
    console.log("Hi from useHook #0 -- App");
    /*
    * Anytime our component mounts, make sure to immiediately set our loading state
    */
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text"> Smart Slayers </p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          <div className="connect-wallet-container">
            {console.log("Hello 1")}
            {renderContent()}
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;