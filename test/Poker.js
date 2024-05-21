const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Test Poker", function () {

    async function deployTokenFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const rc4Contract = await ethers.getContractFactory("RC4");
        const rc4 = await rc4Contract.deploy();
        const Poker = await ethers.getContractFactory("Poker")
        const poker = await Poker.deploy(await rc4.getAddress());
        return { poker, owner, addr1, addr2 };
    }

    // ROUND POKER
    it('ROUND POKER', async () => {
        const { poker, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );
        // poker game create
        let cardArr = [];
        for(let i = 1; i <= 52; i++) {
            cardArr.push(ethers.hexlify(ethers.toUtf8Bytes(i.toString())))
        }
        await poker.createGame(cardArr);

        // players
        let andrija = { name: "andrija", pk: "key1" };
        let kobi = { name: "kobi", pk: "key2" };
        let nico = { name: "nico", pk: "key3" };
        let tom = { name: "tom", pk: "key4" };
        
        // all player shuffle encrypt all cards with key
        // andrija shuffle encrypt
        let cards1 = await poker.getCards();
        let ncards = [];
        for(let i = 0; i < 52; i++) ncards[i] = cards1[i];
        for(let i = 51; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)) % 52;
            [ncards[i], ncards[j]] = [ncards[j], ncards[i]];
        }
        await poker.shuffleEncrypt(ethers.hexlify(ethers.toUtf8Bytes(andrija.pk)), ncards);
        // kobi shuffle encrypt
        let cards2 = await poker.getCards();
        for(let i = 0; i < 52; i++) ncards[i] = cards2[i];
        for(let i = 51; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)) % 52;
            [ncards[i], ncards[j]] = [ncards[j], ncards[i]];
        }
        await poker.shuffleEncrypt(ethers.hexlify(ethers.toUtf8Bytes(kobi.pk)), ncards);
        // nico shuffle encrypt
        let cards3 = await poker.getCards();
        for(let i = 0; i < 52; i++) ncards[i] = cards3[i];
        for(let i = 51; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)) % 52;
            [ncards[i], ncards[j]] = [ncards[j], ncards[i]];
        }
        await poker.shuffleEncrypt(ethers.hexlify(ethers.toUtf8Bytes(nico.pk)), ncards);
        // tom shuffle encrypt
        let cards4 = await poker.getCards();
        for(let i = 0; i < 52; i++) ncards[i] = cards4[i];
        for(let i = 51; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)) % 52;
            [ncards[i], ncards[j]] = [ncards[j], ncards[i]];
        }
        await poker.shuffleEncrypt(ethers.hexlify(ethers.toUtf8Bytes(tom.pk)), ncards);

        // all player deprypt cards other than their own
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(andrija.pk)), 1);
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(andrija.pk)), 2);
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(andrija.pk)), 3);

        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(kobi.pk)), 0);
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(kobi.pk)), 2);
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(kobi.pk)), 3);

        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(nico.pk)), 0);
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(nico.pk)), 1);
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(nico.pk)), 3);

        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(tom.pk)), 0);
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(tom.pk)), 1);
        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes(tom.pk)), 2);

        // each player open cards
        let andrija_card = poker.openCard(ethers.hexlify(ethers.toUtf8Bytes(andrija.pk)), 0);
        let kobi_card = poker.openCard(ethers.hexlify(ethers.toUtf8Bytes(kobi.pk)), 1);
        let nico_card = poker.openCard(ethers.hexlify(ethers.toUtf8Bytes(nico.pk)), 2);
        let tom_card = poker.openCard(ethers.hexlify(ethers.toUtf8Bytes(tom.pk)), 3);
        
        /*  add custom logic of a game:
            1. swap card
            2. place a bet
            3. ...
        */

        // finally each player epen cards
        let andrija_last_card = await poker.openCard(ethers.hexlify(ethers.toUtf8Bytes(andrija.pk)), 0);
        let kobi_last_card = await poker.openCard(ethers.hexlify(ethers.toUtf8Bytes(kobi.pk)), 1);
        let nico_last_card = await poker.openCard(ethers.hexlify(ethers.toUtf8Bytes(nico.pk)), 2);
        let tom_last_card = await poker.openCard(ethers.hexlify(ethers.toUtf8Bytes(tom.pk)), 3);
        
        console.log(`andrija: ${andrija_last_card}`);
        console.log(`kobi: ${kobi_last_card}`);
        console.log(`nico: ${nico_last_card}`);
        console.log(`tom: ${tom_last_card}`);

        // end game
        poker.endGame();
    })

});