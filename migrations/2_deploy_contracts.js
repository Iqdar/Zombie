const ZombieAttack = artifacts.require("ZombieAttack.sol");

module.exports = async function(deployer, network, accounts) {
  deployer.deploy(ZombieAttack);
};
