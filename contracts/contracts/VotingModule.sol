//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ProposalReceiver.sol";

contract VotingModule {
    address public tokenAddress;
    uint256[] public proposals;
    uint256 public totalTokenCount;
    mapping(uint256 => mapping(uint256 => bool)) public approvals;
    mapping(uint256 => uint256) public voteCounts;

    ProposalReceiver private receiver;

    constructor(address _tokenAddress, address _receiverAddress) {
        tokenAddress = _tokenAddress;
        receiver = ProposalReceiver(_receiverAddress);
    }

    function approve(uint256 _proposalId, uint256 _tokenId) public {
        console.log("Approving proposal %s to '%s'", _proposalId, _tokenId);
        if (approvals[_proposalId][_tokenId])
            revert(
                string(
                    abi.encodePacked(
                        "Token ",
                        _tokenId,
                        "has already approved proposal ",
                        _proposalId
                    )
                )
            );
        if (voteCounts[_proposalId] * 2 > totalTokenCount)
            revert(
                string(
                    abi.encodePacked(
                        "Proposal ",
                        _proposalId,
                        " has already been approved"
                    )
                )
            );

        approvals[_proposalId][_tokenId] = true;
        voteCounts[_proposalId]++;
        if (voteCounts[_proposalId] * 2 > totalTokenCount) {
            receiver.handleProposalApproved(_proposalId);
        }
    }
}
