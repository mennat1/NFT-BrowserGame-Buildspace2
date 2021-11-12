const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
        ["Genie", "Shalaby", "Pumpa"],  // Names
        ["https://i.ibb.co/7GLwscx/genie.png",  // Images
        "https://i.ibb.co/pfS2Yh4/shalaby.png", 
        "https://i.ibb.co/mvp2TdR/pumpa.png"],
        // ["QmdHdyRTKtPE7ghXuG9uqjmHm2BereAfac7yDPy1Ks5gnJ",  // Images
        // "QmXzDDmYtNRm4P3G391YVKyjRodXPUKfZH8DJRxyer4zqJ", 
        // "QmZZZVNhFsNJ6S7X2SqBVfSfRHgVS3pEriBFXGzeFYqmNE"],
        [100, 200, 300],    // HP values
        [100, 75, 50],  // Attack damage values
        "Chucky",    // Boss name
        // "QmambzUuHPREMBfn3DXqryRfWVjdZ6YaiLsPdyiJDPgTns",
        "https://i.ibb.co/C8CRcB0/chucky.jpg",  // Boss image
        10000,  // Boss hp
        50  // Boss attack damage
     );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
  
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();