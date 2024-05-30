// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RC4.sol";
import "hardhat/console.sol";

contract Poker {
    RC4 rc4;
    bytes[] public cards;
    // constructor
    constructor(address _rc4Adress) {
        rc4 = RC4(_rc4Adress);
    }
    // create game
    function createGame(bytes[] memory _init_cards) external {
        cards = _init_cards;
    }
    // get cards
    function getCards() external view returns(bytes[] memory) {
        return cards;
    }
    //shuffle encrypt
    function shuffleEncrypt(bytes memory _pk, bytes[] memory _shuffle_cards) external {
        bytes[] memory encrypt_shuffle_cards = new bytes[](52);
        for(uint8 i = 0; i < 52; i++) {
            encrypt_shuffle_cards[i] = rc4.encryptBytes(_shuffle_cards[i], _pk);
        }
        cards = encrypt_shuffle_cards;
    }
    // reveal card
    function revealCard(bytes memory _pk, uint8 _cardno) external {
        cards[_cardno] = rc4.encryptBytes(cards[_cardno], _pk);
    }
    // open card
    function openCard(bytes memory _pk, uint8 _cardno) external view returns (bytes memory) {
        return rc4.encryptBytes(cards[_cardno], _pk);
    }
    // end game
    function endGame() external {
    }
}
