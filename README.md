# Intro

The decentralized roulette project is based on the following contracts, currently deployed on the Kovan testnet:
RNG: Responsible for generating random numbers using Chainlink Verifiable Randomness Function.
Casino: 

# Setup

```npm install```


# Deploy script

To deploy the contracts to the rinkeby testnet, run:

It will check the address for each contract on the contracts.js file. If it is not set, the script will deploy a new contract, otherwise will just use the already deployed contracts.

``` npx hardhat run scripts/deploy.js --network kovan```

The script will automatically publish/verify the contract code using the etherscan plugin.

