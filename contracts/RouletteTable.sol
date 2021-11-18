// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./CasinoLibrary.sol";
import "../interfaces/IRouletteSpinCasino.sol";

contract RouletteTable is ERC721, ERC721Burnable {
    address public operator; // Owner of the table

    CasinoLibrary.TableStatus public tableStatus;
    mapping(uint256 => CasinoLibrary.Bet) public currentBets;
    uint256 betCount;
    uint256 betsAmount;
    uint256 maxPayout;

    IRouletteSpinCasino public casino;
    
    constructor(address _operator,address casinoAddress) ERC721("Roulette Table", "RTBL") {
        operator = _operator;
        casino = IRouletteSpinCasino(casinoAddress);
    }
    
    function mint(address to, uint256 tokenId) public {
        require(msg.sender == address(casino), "Only the casino can mint a roulette table");
        _mint(to, tokenId);
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
        require(tableStatus == CasinoLibrary.TableStatus.BetsOpen, "Rien ne va plus");
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
}
