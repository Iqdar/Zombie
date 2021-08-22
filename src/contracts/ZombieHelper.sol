pragma solidity >=0.5.12;

import "./ZombieFeeding.sol";

contract ZombieHelper is ZombieFeeding {

//Define fee required to level up zombie
    uint levelUpFee = 0.001 ether;

//Added to modify or add some conditions to any functions
    modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
    }

//Owner can withdraw deposited ethers
    function withdraw() external onlyOwner {
        address payable _owner = address(uint160(owner()));
        //Balance transfer to owner
        _owner.transfer(address(this).balance);

    }

//Function to change level up fee by admin of contract
    function setLevelUpFee(uint _fee) external onlyOwner {
        levelUpFee = _fee;
    }

//Function to level up zombie
    function levelUp(uint _zombieId) external payable {
        //Checks the balance sufficient to level up or not
        require(msg.value == levelUpFee);
        zombies[_zombieId].level++;
    }

//Function will run if the added two modifier matches
    function changeName(uint _zombieId, string calldata _newName) external aboveLevel(2, _zombieId) ownerOf(_zombieId) {
        require(msg.sender == zombieOwner[_zombieId]);
        zombies[_zombieId].name = _newName;
    }
    
//Same as above one
    function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, _zombieId) ownerOf(_zombieId) {
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
