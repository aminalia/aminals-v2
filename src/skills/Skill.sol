// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC165} from "oz/utils/introspection/ERC165.sol";
import {IERC165} from "oz/utils/introspection/IERC165.sol";
import {ISkill} from "../interfaces/ISkill.sol";

/**
 * @title Skill
 * @dev Abstract base contract for skills that Aminals can use
 * @dev Handles ERC165 implementation automatically, following OpenZeppelin's pattern
 */
abstract contract Skill is ERC165, ISkill {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(ISkill).interfaceId || super.supportsInterface(interfaceId);
    }
}
