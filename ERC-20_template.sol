// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import "../BaseAssignment.sol";

contract CensorableToken is ERC20, Ownable, BaseAssignment, AccessControl {

    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");

    mapping(address => bool) public isBlacklisted;

    event Blacklisted(address indexed);
    event UnBlacklisted(address indexed);

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply, address _initialOwner)
        BaseAssignment(0x8452E41BA34aC00458B70539264776b2a379448f)
        ERC20(_name, _symbol)
        Ownable(_initialOwner)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, _initialOwner);
        _grantRole(VALIDATOR_ROLE, _initialOwner);
        _mint(_initialOwner, _initialSupply - 10 * 10 ** decimals());
        address validator = msg.sender;
        _mint(validator, 10 * 10 ** decimals());
        _approve(_initialOwner, validator, _initialSupply - 10 * 10 ** decimals());
    }

    modifier onlyAuthorized() {
        require(owner() == msg.sender || isValidator(msg.sender), "Not authorized");
        _;
    }

    function blacklistAddress(address _account) public onlyAuthorized {
        require(!isBlacklisted[_account], "Already blacklisted");
        isBlacklisted[_account] = true;
        emit Blacklisted(_account);
    }

    function unblacklistAddress(address _account) public onlyAuthorized {
        require(isBlacklisted[_account], "Not blacklisted");
        isBlacklisted[_account] = false;
        emit UnBlacklisted(_account);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        require(!isBlacklisted[from], "Sender blacklisted");
        require(!isBlacklisted[to], "Recipient blacklisted");
        super._beforeTokenTransfer(from, to, amount);
    }
}