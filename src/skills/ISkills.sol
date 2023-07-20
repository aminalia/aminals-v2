// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

interface ISkill {
    function useSkill(address sender, uint256 aminalId, bytes calldata data)
        external
        payable
        returns (uint256 squeak);
}
