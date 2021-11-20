// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./CasinoLibrary.sol";
import "../interfaces/IRouletteSpinCasino.sol";
import "../interfaces/IRNC.sol";

contract RouletteTable {
    address public operator; // Owner of the table

    CasinoLibrary.TableStatus public tableStatus;
    mapping(uint256 => CasinoLibrary.Round) internal roundsHistory;
    uint256 internal currentRound;
    uint8 internal betWindow = 120; // seconds after last RNG call to allow betting

    uint256[] drawings;
    mapping(uint256 => CasinoLibrary.Bet) public currentBets;

    IRNC randomNumberConsumer;
    IRouletteSpinCasino public casino;

    modifier onlyRNC() {
        require(msg.sender == address(randomNumberConsumer), "Only RNC calls");
        _;
    }

    constructor(
        address _operator,
        address casinoAddress,
        address rncAddress
    ) {
        operator = _operator;
        casino = IRouletteSpinCasino(casinoAddress);
        randomNumberConsumer = IRNC(rncAddress);
    }

    function deposit(uint256 amount) public {
        casino.deposit(msg.sender, amount);
    }

    function getBets(uint256 roundId) public view returns (CasinoLibrary.Bet[] memory) {
        return roundsHistory[roundId].bets;
    }

    // function to provide info to the UI
    function roundsInfo() public view returns (uint,uint, uint8, uint) {
        //get the current round
        uint256 currentRoundId = randomNumberConsumer.getCurrentRound();

        // get last round info
        uint lastRound = roundsHistory[currentRoundId].id;
        uint8 draw = uint8(randomNumberConsumer.getRoundRandomness(lastRound) % 37);
        uint payoutTotal;

        CasinoLibrary.Bet[] memory bets = getBets(lastRound);
        for (uint256 j = 0; j < bets.length; j++) {
            CasinoLibrary.Bet memory playerBet = bets[j];
            if(playerBet.from == msg.sender) {
                uint8 payout = CasinoLibrary.isWinningBet(playerBet.betId,draw);
                payoutTotal += payout * playerBet.amount;
            }
        }
       
       return (randomNumberConsumer.getLastExecuted(), lastRound, draw, payoutTotal);
       
    }

    function bet(CasinoLibrary.Bet[] memory bets) public {
        require(
            ((randomNumberConsumer.getLastExecuted() + betWindow > block.timestamp) || (randomNumberConsumer.getLastExecuted() == 0)),
            "Bets closed"
        );
        randomNumberConsumer.setBetsPresent();
        uint256 roundId = randomNumberConsumer.getCurrentRound();
        // what was the idea to use "initilized"? It's not used anywhere
        if (!roundsHistory[roundId].initialized) {
            roundsHistory[roundId].initialized = true;
        }
        uint256 total = 0;
        uint256 currentMaxPayout = 0;
        
        for (uint8 i = 0; i < bets.length; i++) {
            require(bets[i].amount > 0, "You can't bet zero");
            CasinoLibrary.RouletteBettingSlot memory rbs = CasinoLibrary.RBS(
                bets[i].betId
            );
            currentMaxPayout += bets[i].amount * (rbs.payoutMultiplier - 1);
            total += bets[i].amount;
            bets[i].from = msg.sender;
            roundsHistory[roundId].bets.push(bets[i]);
        }
        require(
            currentMaxPayout + roundsHistory[roundId].maxPayout <=
                casino.balanceOf(address(this)),
            "We can't afford to pay you if you win"
        );
        casino.bet(msg.sender, total);
        roundsHistory[roundId].betCount += bets.length;
        roundsHistory[roundId].betsAmount += total;
        roundsHistory[roundId].maxPayout += currentMaxPayout;
    }
}
