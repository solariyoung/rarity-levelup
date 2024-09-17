require('dotenv').config()
const ethers = require('ethers')
const { provider, wallet } = require('../config/wallet')

const getGasPrice = async () => {
    try{
        
        let gasPrice = await provider.getGasPrice()
        console.log(ethers.utils.formatUnits(gasPrice, 'gwei'))
    }catch(err){
        error('gas','Could not get gas price,use default instead!')
        console.log(ethers.utils.formatUnits(150, 'gwei'))
        
    }
}

const getNonce = async () => {
    let nonce = await wallet.getTransactionCount()
    console.log(nonce)
}

const pause = async () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000)
    })
}

const log = (methodName, summonerId, msg) => {
    console.log(`${methodName}[${summonerId}]: ${msg}`)
}

const error = (methodName, summonerId, msg) => {
    console.error(`${methodName}[${summonerId}]: ${msg}`)
}

module.exports = {
    getGasPrice,
    getNonce,
    pause,
    log,
    error,
}
