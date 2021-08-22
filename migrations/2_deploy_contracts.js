const ZombieFactory = artifacts.require("ZombieFactory.sol");
const ZombieHelper = artifacts.require("ZombieHelper.sol");
const Ownable = artifacts.require("Ownable.sol");
const ZombieFeeding = artifacts.require("ZombieFeeding.sol");

module.exports = async function(deployer, network, accounts) {
  deployer.deploy(ZombieHelper);
};
