pragma solidity 0.5.12;

contract ZombieFactory{

    uint public totalZombies = 0;

    struct Zombie{
        uint id;
        string name;
        uint dna;
    }

    event NewZombie(
        uint id,
        string name,
        uint dna
    );

    mapping(uint => Zombie) public zombies;

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    function newZombie(string memory _name)public{
    	require((bytes(_name).length > 0));
        totalZombies++;
        uint dna = genDna(_name);
        zombies[totalZombies] = Zombie(totalZombies,_name,dna);
        emit NewZombie(totalZombies,_name,dna);
    }

    function genDna(string memory text)private view returns (uint){
        uint rnd = uint(keccak256(abi.encodePacked(text)));
        uint dna = rnd % dnaModulus;
        return dna;
    }

}