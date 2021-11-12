require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: '0.8.0',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    
  },
};

// Contract deployed to: 0xd8363684E115D3f7c71e1C69a51A36bEFd464eB5
// Contract deployed to: 0x2B6a5FEDBE1031b325b1C4D6df2ec5Dd4fAE4E6f
// Contract deployed to: 0x6A91031f7141deE5435D54C3Ec60441CC892a827
// Contract deployed to: 0xE678C68512Ad0e08CBfA92E370aFB2Ba2BB0C2Dd
// Contract deployed to: 0xF5950c5fE17f9eE2359F65a11C7aDF95d164Ac90
