// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

/**
 * @title IAminalStructs - Core Data Structures for Aminal System
 * @notice Defines fundamental data types used throughout the Aminal ecosystem
 * @dev Shared interface containing structs and enums for visual traits and genetics
 *
 * @author The Aminals Collective
 * @custom:security-contact security@aminals.art
 */
interface IAminalStructs {
    /**
     * @notice Visual trait configuration for an Aminal
     * @dev Contains the complete genetic visual profile of an Aminal
     * @param backId Gene ID for background/back visual trait
     * @param armId Gene ID for arm/limb visual trait
     * @param tailId Gene ID for tail visual trait
     * @param earsId Gene ID for ear visual trait
     * @param bodyId Gene ID for body/torso visual trait
     * @param faceId Gene ID for face visual trait
     * @param mouthId Gene ID for mouth/expression visual trait
     * @param miscId Gene ID for miscellaneous/accessory visual trait
     */
    struct Visuals {
        uint256 backId;
        uint256 armId;
        uint256 tailId;
        uint256 earsId;
        uint256 bodyId;
        uint256 faceId;
        uint256 mouthId;
        uint256 miscId;
    }

    /**
     * @notice Enumeration of visual trait categories
     * @dev Used for indexing and organizing different types of visual genes
     * Categories correspond to the fields in the Visuals struct
     */
    enum VisualsCat {
        BACK, // Background/environment traits
        ARM, // Limb and appendage traits
        TAIL, // Tail variations and styles
        EARS, // Ear shapes and features
        BODY, // Core body structure and coloring
        FACE, // Facial features and expressions
        MOUTH, // Mouth, teeth, and vocal expressions
        MISC // Accessories, special effects, and unique features

    }
}
