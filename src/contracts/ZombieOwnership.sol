pragma solidity >=0.5.12;

import "./ZombieAttack.sol";
import './ERC721.sol';

contract ZombieOwnership is ZombieAttack, ERC721 {

    mapping (uint => address) zombieApprovals;

//Returns total zombies person owns
    function balanceOf(address _owner) external view returns (uint256) {
        return ownerZombieCount[_owner];
    }

//Return account address of zombie owner
    function ownerOf(uint256 _tokenId) external view returns (address) {
        return zombieOwner[_tokenId];
    }

//Transfer one zombie to other account owner
    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
        ownerZombieCount[_from] = ownerZombieCount[_from].sub(1);
        zombieOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

//Checks requirements and then execute method given above
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable  {
        require (zombieOwner[_tokenId] == msg.sender || zombieApprovals [_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

//to approve whether the person is owner of zombie
    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        zombieApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

}
