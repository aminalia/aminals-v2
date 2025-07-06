// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

// TODO maybe remove?
interface IProposals {
    /// We dream of Aminals voting together in Aminal Democracy.
    // function AminalVote(
    //     uint256 aminalID,
    //     uint256 proposalId,
    //     bool yesNo,
    //     uint256 membersLength,
    //     uint256 quorum,
    //     uint256 requiredMajority
    // ) external;

    function LoveVote(
        uint256 aminalID,
        address sender,
        uint256 proposalId,
        bool yesNo,
        uint256 membersLength,
        uint256 quorum,
        uint256 requiredMajority
    ) external returns (uint256 squeak);

    function getQuorum(uint256 proposalTime, uint256 currentTime) external view returns (uint256);

    // Memories <3 <3 <3
    // function getAddress1(uint256 proposalId) external view returns (address);
}
