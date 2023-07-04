// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

interface IProposals {
    enum ProposalType {
        AddSkill, //  0 Add skill
        RemoveSkill //  1 Remove skill
    }

    function proposeAddSkill(uint256 aminalID, string calldata skillName, address skillAddress) external returns (uint256 proposalId);
    function proposeRemoveSkill(uint256 aminalID, string calldata description, address skillAddress)
        external
        returns (uint256 proposalId);

    function vote(uint256 aminalID, uint256 proposalId, bool yesNo, uint256 membersLength, uint256 quorum, uint256 requiredMajority)
        external;

    function getInitiated(uint256 proposalId) external view returns (uint256);

    function getProposalType(uint256 proposalId) external view returns (ProposalType);

    function toExecute(uint256 proposalId) external view returns (bool);

    function getDescription(uint256 proposalId) external view returns (string memory);

    function getAddress1(uint256 proposalId) external view returns (address);
    function getAmount(uint256 proposalId) external view returns (uint256);

    function close(uint256 proposalId) external;
}
