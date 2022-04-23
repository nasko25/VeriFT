//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TicketNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;
    string tokenURIVal;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _tokenURI
    ) ERC721(_name, _symbol) {
        tokenURIVal = _tokenURI;
    }

    function mintNFT(address recipient) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURIVal);
        return newItemId;
    }
}

contract Event {
    address public NFTToHold;
    uint256 public maxTicketNumber;
    uint256 public price;
    mapping(uint256 => uint256) public mintedFromIndex;
    mapping(uint256 => string[]) public hashesForNFT;
    string[] public hashes;
    address public ticketNFTContract;
    address public owner;

    constructor(
        address _NFTToHold,
        uint256 _maxTicketNumber,
        uint256 _price,
        string memory _eventName,
        string memory _eventSymbol,
        string memory _tokenURI
    ) {
        NFTToHold = _NFTToHold;
        maxTicketNumber = _maxTicketNumber;
        price = _price;
        ticketNFTContract = address(
            new TicketNFT(_eventName, _eventSymbol, _tokenURI)
        );
        owner = msg.sender;
    }

    function mintTicket(uint256 _index, string memory _hash)
        external
        returns (uint256)
    {
        require(
            ERC721(NFTToHold).ownerOf(_index) == msg.sender,
            "You do not own this NFT"
        );
        require(
            mintedFromIndex[_index] < maxTicketNumber,
            "All possible tickets have been minted from this NFT"
        );
        payable(owner).transfer(price);
        mintedFromIndex[_index] += 1;
        hashesForNFT[_index].push(_hash);
        hashes.push(_hash);
        return TicketNFT(ticketNFTContract).mintNFT(msg.sender);
        return 0;
    }
}
