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

    uint[] drawings;
    mapping(uint256 => CasinoLibrary.Bet) public currentBets;

    IRNC randomNumberConsumer;
    IRouletteSpinCasino public casino;

    modifier onlyRNC() {
        require(msg.sender == address(randomNumberConsumer), "Only RNC calls");
        _;
    }

    constructor(address _operator, address casinoAddress, address rncAddress) {
        operator = _operator;
        casino = IRouletteSpinCasino(casinoAddress);
        randomNumberConsumer = IRNC(rncAddress);
    }

    function deposit(uint256 amount) public {
        casino.deposit(msg.sender, amount);
    }

    function getBets(uint256 roundId) public view returns (CasinoLibrary.Bet[] memory) {
        CasinoLibrary.Bet[] memory bets;
        if (roundId == 0) {
            roundId = randomNumberConsumer.getCurrentRound();
        }
        for (uint256 i = 0; i < roundsHistory[roundId].betCount; i++) {
            bets[i] = currentBets[i];
        }
        return bets;
    }

    function bet(CasinoLibrary.Bet[] memory bets) public {
        randomNumberConsumer.setBetsPresent();
        uint256 roundId = randomNumberConsumer.getCurrentRound();
        if (!roundsHistory[roundId].initialized) {
            roundsHistory[roundId].initialized = true;
        }
        uint256 total = 0;
        uint256 currentMaxPayout = 0;
        uint256 betCount = roundsHistory[roundId].betCount;
        for (uint8 i = 0; i < bets.length; i++) {
            require(bets[i].amount > 0, "You can't bet zero");
            require(bets[i].from == msg.sender, "Did you just try to bet for someone else?");
            CasinoLibrary.RouletteBettingSlot memory rbs = CasinoLibrary.RBS(bets[i].betId);
            currentMaxPayout += bets[i].amount * (rbs.payoutMultiplier - 1);
            total += bets[i].amount;
            roundsHistory[roundId].bets[i + betCount].from = bets[i].from;
            roundsHistory[roundId].bets[i + betCount].amount = bets[i].amount;
            roundsHistory[roundId].bets[i + betCount].betId = bets[i].betId;
        }
        require(currentMaxPayout + roundsHistory[roundId].maxPayout <= casino.balanceOf(address(this)), "We can't afford to pay you if you win");
        casino.bet(msg.sender, total);
        roundsHistory[roundId].betCount += bets.length;
        roundsHistory[roundId].betsAmount += total;
        roundsHistory[roundId].maxPayout += currentMaxPayout;
    }

    function getRoundResult(uint _roundId) public view returns (uint8) {
        uint256 draw = randomNumberConsumer.getRoundRandomness(_roundId);
        return uint8(uint256(keccak256(abi.encodePacked(draw, address (this)))) % 37);
    }
}
