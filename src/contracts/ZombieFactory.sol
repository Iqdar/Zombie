pragma solidity >=0.5.12;

import "./Ownable.sol";
import './SafeMath.sol';

contract ZombieFactory is Ownable{

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint public totalZombies = 0;

    struct Zombie{
        uint id;
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        uint16 winCount;
        uint16 lossCount;
    }

    event NewZombie(
        uint id,
        string name,
        uint dna,
        uint32 level,
        uint32 readyTime,
        uint16 winCount,
        uint16 lossCount
    );

//For storing zombie
    mapping(uint => Zombie) public zombies;
//For storing address of all id zombies
    mapping (uint => address) public zombieOwner;
//For storing zombie count of all address
    mapping (address => uint) ownerZombieCount;

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;
    uint cooldownTime = 1 days;

//Function called for new zombie publicly
    function newZombie(string memory _name)public{
    	require((bytes(_name).length > 0));
        uint dna = genDna(_name);
        _createZombie(_name, dna);
    }

//Function to process and store new zombie
    function _createZombie(string memory _name, uint dna)internal{
    	require((bytes(_name).length > 0) && (ownerZombieCount[msg.sender] == 0));
        totalZombies++;
        zombieOwner[totalZombies] = msg.sender;
        ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
        zombies[totalZombies] = Zombie(totalZombies,_name,dna, 1, uint32(now + cooldownTime),0,0);
        emit NewZombie(totalZombies,_name,dna, 1, uint32(now + cooldownTime),0,0);
    }

//Function to generate dna from text
    function genDna(string memory text)private view returns (uint){
        uint rnd = uint(keccak256(abi.encodePacked(text)));
        uint dna = rnd % dnaModulus;
        return dna;
    }

}