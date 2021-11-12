const CONTRACT_ADDRESS = '0xF5950c5fE17f9eE2359F65a11C7aDF95d164Ac90';

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    // imageURI: `https://gateway.pinata.cloud/ipfs/${characterData.imageURI}`,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };