pragma solidity >=0.5.12;

import "./ZombieFeeding.sol";

contract ZombieHelper is ZombieFeeding {

//Added to modify or add some conditions to any functions
    modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
    }

//Function will run if the added condition matches
    function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) {
        require(msg.sender == zombieOwner[_zombieId]);
        zombies[_zombieId].name = _newName;
    }

    function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) {
        require(msg.sender == zombieOwner[_zombieId]);
        zombies[_zombieId].dna = _newDna;
    }

//Getting all zombies by specific owner
    function getZombiesByOwner(address _owner) external view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerZombieCount[_owner]);
        uint count = 0;
        //Checking zombies one by one
        for (uint i = 1; i <= totalZombies; i++) {
            //If matches, then storing id in array
            if (zombieOwner[i] == _owner) {
                result[count] = i;
                count++;
            }
        }
        return result;
    }

}
