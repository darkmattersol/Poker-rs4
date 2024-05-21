const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Test Poker", function () {

    async function deployTokenFixture() {
        // Get the Signers here.
        const [owner, addr1, addr2] = await ethers.getSigners();

        // To deploy our contract, we just have to call ethers.deployContract and await
        // its waitForDeployment() method, which happens once its transaction has been
        // mined.
        const rc4Contract = await ethers.getContractFactory("RC4");
        const rc4 = await rc4Contract.deploy();
        const Poker = await ethers.getContractFactory("Poker")
        const poker = await Poker.deploy(await rc4.getAddress());

        // await poker.waitForDeployment();
        // await rc4.waitForDeployment();

        // Fixtures can return anything you consider useful for your tests
        return { poker, owner, addr1, addr2 };
    }

    it('get cards', async () => {
        const { poker, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );

        // expect(cards).to.equal(gamid);
    })

    it('creategame ', async () => {
        const { poker, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );

        let arr = [];

        for (let i = 1; i <= 52; i++) {
            arr.push(ethers.hexlify(ethers.toUtf8Bytes(i.toString())));
        }

        await poker.createGame(arr);

        const ncards = await poker.getCards();

        // expect(cards).to.equal(gamid);
    })

    it('shuffle encrypt ', async () => {

        const { poker, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );

        let arr = [];

        for (let i = 52; i >= 1; i--) {
            arr.push(ethers.hexlify(ethers.toUtf8Bytes(i.toString())));
        }

        await poker.shuffleEncrypt(ethers.hexlify(ethers.toUtf8Bytes("key")), arr);

        const ncards = await poker.getCards();

        // expect(cards).to.equal(gamid);
    })

    it('reveal card ', async () => {

        const { poker, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );

        let arr = [];

        for (let i = 1; i <= 52; i++) {
            arr.push(ethers.hexlify(ethers.toUtf8Bytes(i.toString())));
        }

        await poker.createGame(arr);

        let arr1 = [];

        for (let i = 52; i >= 1; i--) {
            arr1.push(ethers.hexlify(ethers.toUtf8Bytes(i.toString())))
        }

        await poker.shuffleEncrypt(ethers.hexlify(ethers.toUtf8Bytes("key")), arr1);

        const ncards = await poker.getCards();
        console.log(ncards);

        await poker.revealCard(ethers.hexlify(ethers.toUtf8Bytes("key")), 1);
        const re_cards = await poker.getCards();

        console.log(re_cards);

        // expect(cards).to.equal(gamid);
    })
    // open card
    it('open card ', async () => {

        const { poker, owner, addr1, addr2 } = await loadFixture(
            deployTokenFixture
        );

        let arr1 = [];

        for (let i = 52; i >= 1; i--) {
            arr1.push(ethers.hexlify(ethers.toUtf8Bytes(i.toString())))
        }

        await poker.shuffleEncrypt(ethers.hexlify(ethers.toUtf8Bytes("key")), arr1);

        const cards = await poker.getCards();

        const openCards = await poker.openCard(ethers.hexlify(ethers.toUtf8Bytes("key")), 0);

    })
    // ROUND POKER
    it('ROUND POKER', async () => {

    })

});