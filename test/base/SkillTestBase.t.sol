// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {IAminal} from "src/interfaces/IAminal.sol";
import {ISkill} from "src/interfaces/ISkill.sol";
import {AminalTestBase} from "./AminalTestBase.t.sol";

/**
 * @title SkillTestBase
 * @notice Base contract for skill-related tests
 */
abstract contract SkillTestBase is AminalTestBase {
    // Events
    event SkillUsed(address indexed user, uint256 energyCost, address indexed target, bytes4 indexed selector);

    // Test aminals for skill testing
    address public testAminal1;
    address public testAminal2;

    function setUp() public virtual override {
        super.setUp();

        // Create test aminals
        (testAminal1, testAminal2) = createParentAminals();

        // Give test accounts ETH for feeding
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);

        // Give initial energy/love for skill testing
        vm.prank(alice);
        payable(testAminal1).call{value: 1 ether}("");
        vm.prank(bob);
        payable(testAminal2).call{value: 1 ether}("");
    }

    function _useSkill(address user, address targetAminal, address skillContract, bytes memory calldata_) internal {
        vm.prank(user);
        IAminal(payable(targetAminal)).useSkill(skillContract, calldata_);
    }

    function _expectSkillEvent(address user, address skillContract, uint256 expectedCost, bytes4 selector) internal {
        vm.expectEmit(true, true, true, true);
        emit SkillUsed(user, expectedCost, skillContract, selector);
    }

    function _assertSkillCost(
        uint256 energyBefore,
        uint256 energyAfter,
        uint256 loveBefore,
        uint256 loveAfter,
        uint256 expectedCost
    ) internal {
        assertEq(energyBefore - energyAfter, expectedCost, "Energy cost mismatch");
        assertEq(loveBefore - loveAfter, expectedCost, "Love cost mismatch");
    }

    function _assertSkillReverts(
        address user,
        address targetAminal,
        address skillContract,
        bytes memory calldata_,
        bytes4 expectedError
    ) internal {
        vm.prank(user);
        vm.expectRevert(expectedError);
        IAminal(payable(targetAminal)).useSkill(skillContract, calldata_);
    }

    function _createMockSkill(uint256 returnCost) internal returns (address) {
        MockSkill skill = new MockSkill(returnCost);
        return address(skill);
    }
}

/**
 * @title MockSkill
 * @notice Simple mock skill for testing
 */
contract MockSkill is ISkill {
    uint256 public immutable cost;

    constructor(uint256 _cost) {
        cost = _cost;
    }

    function skillCost(bytes calldata) external view returns (uint256) {
        return cost;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(ISkill).interfaceId || interfaceId == 0x01ffc9a7; // ERC165
    }
}
