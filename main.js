require("dotenv").config();
const ethers = require("ethers");
const contractAddress = "0xce761D788DF608BD21bdd59d6f4B54b2e27F25Bb";
const summonerIds = [
  //  163446, 163414, 163388, 163360, 163321, 163286, 163247, 163201, 163168,
  163150, 143820,
];
const rarityAbi = require("./abis/rarity.json");
const endpoint = process.env.FTMPROVIDER;

const provider = new ethers.providers.JsonRpcProvider(endpoint, 250);
const Wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
const wallet = Wallet.connect(provider);
const contract = new ethers.Contract(contractAddress, rarityAbi, wallet);
async function getGasPrice() {
  let gasPrice = await provider.getGasPrice();
  console.log(ethers.utils.formatUnits(gasPrice, "gwei"));
}

// get the time until next adventure
async function getAdventureLog(id) {
  await provider.ready;
  let adventurersLog = await contract.adventurers_log(id);
  return adventurersLog;
}

// sends your summoner on an adventure!
async function adventure() {
  let timestamp = await provider.getBlock();
  currentTime = ethers.BigNumber.from(timestamp.timestamp);
  summonerIds.forEach(async (id) => {
    let adventureTimestamp = await getAdventureLog(id);
    if (currentTime.gt(adventureTimestamp)) {
      try {
        await contract.adventure(id)
        console.log(`We adventured for summoner ${id}!`);
      } catch {
        console.log('could not send the tx');
      }
    } else {
      console.log(`not yet time to adventure for ${id}`);
    }
  });
}

adventure().catch((err) => {
  console.log(err);
});
