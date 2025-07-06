// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import {IAminalStructs} from "src/interfaces/IAminalStructs.sol";

// TODO review what should be in here
interface IAminalFactory is IAminalStructs {
    /**
     * @notice Spawn a new Aminal from auction results
     * @param momAddress Address of the mother Aminal
     * @param dadAddress Address of the father Aminal
     * @param winningGeneIds Array of winning gene IDs for each trait category
     * @return Address of the newly spawned Aminal
     */
    function spawnAminal(address momAddress, address dadAddress, uint256[8] calldata winningGeneIds)
        external
        returns (address);

    /**
     * @notice Check if an address is an Aminal contract
     * @param aminalAddress Address to check
     * @return True if address is an Aminal contract
     */
    function isAminal(address aminalAddress) external view returns (bool);

    /**
     * @notice Get Aminal address by index
     * @param index Index of the Aminal
     * @return Address of the Aminal
     */
    function getAminalByIndex(uint256 index) external view returns (address);

    /**
     * @notice Get visual traits of an Aminal
     * @param aminalAddress Address of the Aminal
     * @return Visuals struct containing trait IDs
     */
    function getAminalVisualsByAddress(address aminalAddress) external view returns (Visuals memory);

    /**
     * @notice Get total number of Aminals
     * @return Total count of Aminals
     */
    function totalAminals() external view returns (uint256);
}
