import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import LoadingIndicator from '../LoadingIndicator';


const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false);



  // Actions
  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        setMintingCharacter(true);
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
      setMintingCharacter(false);
    }
  };

  // UseEffect
  useEffect(() => {
    console.log("Hello from useHook #2 -- SelectCharacter");

    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      /*
      * This is the big difference. Set our gameContract in state.
      */
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);
  


  useEffect(() => {
    console.log("Hello from useHook #3 -- SelectCharacter");
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');

        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);

        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        setCharacters(characters);
        console.log("CHARACTERSSSS: ", characters);
        console.log("Just set Characters");
        console.log("Characters.length= ", characters.length);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };

    /*
    * Add a callback method (Listener) that will fire when this event is received
    */
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );
      // alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`);

      /*
      * Once our character NFT is minted we can fetch the metadata from our contract
      * and set it in state to move onto the Arena
      */
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNFT: ', characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
        console.log("CHARACTER NFT: ", characterNFT);
      }
    };

    // When the component mounts
    if (gameContract) {
      getCharacters();

      /*
      * Setup NFT Minted Listener
      */
      gameContract.on('CharacterNFTMinted', onCharacterMint);
    }

    return () => {
      /*
      * When your component unmounts, lets make sure to clean up this listener
      */
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint);
        
      }
    };
  }, [gameContract]);


  // Syntax ?????
  const renderCharacters = () => 
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            // src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            src="https://gateway.pinata.cloud/ipfs/QmYa1j8hoP4hFA1BoeCXTE7xeWvyf3rg35336hexzCnixg"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );

};

export default SelectCharacter;