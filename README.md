# Intro

The decentralized roulette project is based on the following contracts, currently deployed on the Rinkeby testnet:

RNC: Responsible for consuming random numbers from Chainlink Verifiable Randomness Function.
RouletteSpinCasino: ERC20 compatible contract that allows for minting roulette tables
RouletteTable: Deployed by the RouletteSpinCasino while setting owner
TableNFT: Minting of the table's NFT, used for access control inside the RouletteTable and exchangeable just like any NFT

# Setup

```npm install```


# Deploy script

To deploy the contracts to the rinkeby testnet, run:

It will check the address for each contract on the contracts.js file. If it is not set, the script will deploy a new contract, otherwise will just use the already deployed contracts.

``` npx hardhat run scripts/deploy.js --network rinkeby```

The script will automatically publish/verify the contract code using the etherscan plugin.


# Angular 13 Frontend:

  # Setup:
    npm install  - 
    
   # Angular Specific commands:
    ng build - 
    ng serve  - to run web server. 
