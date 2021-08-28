const ZombieFactory = artifacts.require("ZombieFactory.sol");
const ZombieFeeding = artifacts.require("ZombieFeeding.sol");
const ZombieHelper = artifacts.require("ZombieHelper.sol");
const ZombieAttack = artifacts.require("ZombieAttack.sol");
const ZombieOwnership = artifacts.require("ZombieOwnership.sol");

module.exports = async function(deployer, network, accounts) {
  deployer.deploy(ZombieFactory)
  const zf = await ZombieFactory.deployed()
  deployer.deploy(ZombieFeeding, zf.address)
  const zfe = await ZombieFeeding.deployed()
  deployer.deploy(ZombieHelper, zfe.address)
  const zh = await ZombieHelper.deployed()
  deployer.deploy(ZombieAttack, zh.address)
  const za  = await ZombieAttack.deployed()
  deployer.deploy(ZombieOwnership, za.address)
};