// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

interface IVisualAuction {
    function canSpawn(
        uint256 aminalOne,
        uint256 aminalTwo,
        uint256 backId,
        uint256 armId,
        uint256 tailId,
        uint256 earsId,
        uint256 bodyId,
        uint256 faceId,
        uint256 mouthId,
        uint256 miscId
    ) external view returns (bool);
}
