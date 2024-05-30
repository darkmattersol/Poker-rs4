const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const PokerModule = buildModule("PokerModule", (m) => {
  const Poker = m.contract("Poker");

  return { Poker };
});

module.exports = PokerModule;