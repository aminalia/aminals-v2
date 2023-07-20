// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "./IAminalStructs.sol";

interface IAminal is IAminalStructs {
    function callSkill(uint256 aminalId, address skillAddress, bytes calldata data) external payable;
    function callSkillInternal(address sender, uint256 aminalId, address skillAddress, bytes calldata data)
        external
        payable;

    error NotEnoughEther();
}
