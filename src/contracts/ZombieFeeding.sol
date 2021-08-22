pragma solidity 0.5.12;

import "./ZombieFactory.sol";

contract KittyInterface {
    function getKitty(uint256 _id) external view returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    );
}

contract ZombieFeeding is ZombieFactory{

    KittyInterface kittyContract;

//Modifier or conditions can be used to run any function
    modifier ownerOf(uint _zombieId) {
        require(msg.sender == zombieOwner[_zombieId]);
        _;
    }

    function setKittyContractAddress(address _address) external {
        kittyContract = KittyInterface(_address);
    }

//Add cooldown after trigger
    function _triggerCooldown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(now + cooldownTime);
    }

//Checks whether cooldown time is complete or not
    function _isReady(Zombie storage _zombie) internal view returns (bool) {
        return (_zombie.readyTime <= now);
    }

//Adding new zombie of the added zombie's owner with condition from modifier
    function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) internal  ownerOf(_zombieId){
        Zombie storage myZombie = zombies[_zombieId];
        //Checks cooldown
        require(_isReady(myZombie));
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
            newDna = newDna - newDna % 100 + 99;
        }
        //Adding new zombie
        _createZombie("NoName", newDna);
        //New cooldown
        _triggerCooldown(myZombie);
    }

    function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);

        feedAndMultiply(_zombieId, kittyDna, "kitty");
    }
}