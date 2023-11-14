// SPDX-License-Identifier: MIT

pragma solidity 0.8.2;

contract SimpleBank {

    // owner
    address public owner;

    // user balance: [useraccount => balance]
    mapping(address => uint256) private balances;

    // Events
    event DepositMade(address indexed accountAddress, uint256 amount);
    event WithdrawalMade(address indexed accountAddress, uint256 amount);

    // Modifier to require the caller to be the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller must be the owner");
        _;
    }

    constructor() {
       owner = msg.sender;
    }

    // deposit
    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        uint256 amount = msg.value;
        balances[msg.sender] = balances[msg.sender] + amount;
        // balances[msg.sender] += amount;

        emit DepositMade(msg.sender, amount);
    }

    // Withdraw 
    function withdraw(uint256 amount) public {
        require(amount <= balances[msg.sender], "Insufficient Balance");
        balances[msg.sender] = balances[msg.sender] - amount;
        // balances[msg.sender] -= amount;

        payable(msg.sender).transfer(amount);

        emit WithdrawalMade(msg.sender, amount);
    }

    // balance
    function balance() public view returns(uint256) {
        return balances[msg.sender];
    }

    // Increase user balance
    function creditAccount(address account, uint256 amount) public onlyOwner {
        // require(msg.sender == owner, "Only owner can change balance");
        require(account != address(0), "Cannot credit the zero address");

        balances[account] = balances[account] + amount;
        // balances[account] += amount;
    }
}