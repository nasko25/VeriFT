//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface ProposalReceiver {
    function handleProposalApproved(uint256 _proposalId) external;
}

contract NewsDAO is ProposalReceiver {
    function handleProposalApproved(uint256 _proposalId)
        external
        view
        override
    {
        console.log(
            string(abi.encodePacked("Proposal ", _proposalId, " approved!"))
        );
    }
}
