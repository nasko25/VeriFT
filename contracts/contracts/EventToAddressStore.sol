//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Event.sol";

contract EventToAddressStore {
    mapping(string => address) public eventNameToAddress;
    mapping(address => string) public addressToUri;

    // set the address of the deployed contract for a given event
    function setAddressForEvent (string memory _eventName, address _addr) external
            returns ( uint256 ) {

        require(Event(_addr).owner() == msg.sender, "You do not own this contract.");
        eventNameToAddress[_eventName] = _addr;

        return 0;
    }

    // set the URI given by the event organizers for a given deployed contract
    function setUriForAddress (string memory _uri, address _addr) external
            returns ( uint256 ) {

        require(Event(_addr).owner() == msg.sender, "You do not own this contract.");
        addressToUri[_addr] = _uri;

        return 0;
    }

    function setAddressAndUriForEvent (address _addr, string memory _uri, string memory _eventName) external
        returns ( uint256 ) {

            require(Event(_addr).owner() == msg.sender, "You do not own this contract.");
            eventNameToAddress[_eventName] = _addr;
            addressToUri[_addr] = _uri;

            return 0;
        }
}