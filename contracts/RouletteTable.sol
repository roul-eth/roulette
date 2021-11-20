// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./CasinoLibrary.sol";
import "../interfaces/IRouletteSpinCasino.sol";
import "../interfaces/IRNC.sol";

contract RouletteTable {
    address public operator; // Owner of the table

    CasinoLibrary.TableStatus public tableStatus;
    mapping(uint256 => CasinoLibrary.Round) roundsHistory;
    uint256 internal currentRound;

    uint[] drawings;
    mapping(uint256 => CasinoLibrary.Bet) public currentBets;
    uint256 betCount;
    uint256 betsAmount;
    uint256 maxPayout;

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

    function getBets() public view returns (CasinoLibrary.Bet[] memory) {
        CasinoLibrary.Bet[] memory bets;
        for (uint256 i = 0; i < betCount; i++) {
            bets[i] = currentBets[i];
        }
        return bets;
    }

    function bet(CasinoLibrary.Bet[] memory bets) public {
        randomNumberConsumer.setBetsPresent();
        uint256 total = 0;
        for (uint8 i = 0; i < bets.length; i++) {
            require(bets[i].amount > 0, "You can't bet zero");
            require(bets[i].from == msg.sender, "Did you just try to bet for someone else?");
            CasinoLibrary.RouletteBettingSlot memory rbs = CasinoLibrary.RBS(bets[i].betId);
            maxPayout += bets[i].amount * (rbs.payoutMultiplier - 1);
            total += bets[i].amount;
            currentBets[betCount++] = bets[i];
        }
        require(total <= casino.balanceOf(msg.sender), "Don't bet more than you can afford");
        require(maxPayout <= casino.balanceOf(address(this)), "We can't afford to pay you if you win");
        betsAmount += total;
    }

    function getRoundResult(uint _roundId) public view returns (uint) {
        uint256 draw = randomNumberConsumer.getRoundRandomness(_roundId);
        return uint(keccak256(abi.encodePacked(draw, address (this)))) % 37;
    }
}
