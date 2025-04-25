// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERCensor20 is ERC20, Ownable {
    address public validator;
    mapping(address => bool) public isBlacklisted;

    event Blacklisted(address indexed);
    event UnBlacklisted(address indexed);

    constructor(address _validator) ERC20("ERCensor", "ERCN") {
        require(_validator != address(0), "Validator cannot be zero address");

        validator = _validator;

        // Mint tokens: >10 to owner, 10 to validator
        _mint(msg.sender, 1000 * 10 ** decimals());
        _mint(_validator, 10 * 10 ** decimals());

        // Approve validator to spend owner's tokens
        _approve(msg.sender, _validator, balanceOf(msg.sender));
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner() || msg.sender == validator, "Not authorized");
        _;
    }

    function blacklistAddress(address addr) public onlyAuthorized {
        require(!isBlacklisted[addr], "Already blacklisted");
        isBlacklisted[addr] = true;
        emit Blacklisted(addr);
    }

    function unblacklistAddress(address addr) public onlyAuthorized {
        require(isBlacklisted[addr], "Not blacklisted");
        isBlacklisted[addr] = false;
        emit UnBlacklisted(addr);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!isBlacklisted[from], "Sender is blacklisted");
        require(!isBlacklisted[to], "Recipient is blacklisted");
        super._beforeTokenTransfer(from, to, amount);
    }
}