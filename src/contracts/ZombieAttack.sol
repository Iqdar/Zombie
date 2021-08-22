pragma solidity >=0.5.12;

import "./zombiehelper.sol";

contract ZombieAttack is ZombieHelper {
  uint randNonce = 0;

  uint attackVictoryProbability = 70;

//Generates a random number with a process to secure from similar outputs
  function randMod(uint _modulus) internal returns(uint) {
    randNonce++;
    return uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
  }

//Attack function in a battle runs if modifier matches
  function attack(uint _zombieId, uint _targetId) external ownerOf(_zombieId) {
    Zombie storage myZombie = zombies[_zombieId];
    Zombie storage enemyZombie = zombies[_targetId];
    //Random number btww 0 to 100
    uint rand = randMod(100);
    //If random number is less than or equals to 70
    if (rand <= attackVictoryProbability) {
        //Your win and attacker loss count increased and new zombie added whose owner is attacker 
        myZombie.winCount++;
        myZombie.level++;
        enemyZombie.lossCount++;
        feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
    }
    //If greater than 70
    else {
        //Your loss and attacker's win count incremented and cooldown added
        myZombie.lossCount++;
        enemyZombie.winCount++;
        _triggerCooldown(myZombie);
    }
  }
}
