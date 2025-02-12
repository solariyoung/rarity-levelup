require('dotenv').config()
const ethers = require('ethers')
const contracts = require('../config/contracts')
const rarityContractAddress = contracts.rarity
const rarityAbi = require('../abis/rarity.json')
const { provider, nonceManager } = require('../config/wallet')
const { log, error } = require('./utils')

const contract = new ethers.Contract(rarityContractAddress, rarityAbi, provider)
const writeContract = contract.connect(nonceManager)
const { pause } = require('./utils')

// get the time until next adventure
const getAdventureLog = async (id) => {
    await provider.ready
    let adventurersLog = await contract.adventurers_log(id)
    return adventurersLog
}

// sends your summoner on an adventure!
const adventure = async (summonerId, currentTime,gap = 0) => {
    let adventureTimestamp = await getAdventureLog(summonerId)
    if (currentTime.gt(adventureTimestamp)) {
        try {
            let response = await writeContract.adventure(summonerId)
            /* let receipt = */ await response.wait()
            // log("adventure", summonerId, receipt);
            log('adventure', summonerId, `Adventure successfull!`)
            pause()
        } catch (err) {
            error('adventure', summonerId, `Could not send the tx: ${err}`)
            if (gap-- >0){
                await adventure(summonerId,currentTime,gap);
            }
        }
    } else {
        log('adventure', summonerId, `Not yet time to adventure.`)
    }
}

module.exports = adventure

// adventure().catch((err) => {
//   console.error(err);
// });
