// SPDX-License-Identifier: MIT

pragma solidity 0.8.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.0/contracts/security/ReentrancyGuard.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.0/contracts/token/ERC20/utils/SafeERC20.sol";

interface IERC20 {

  function balanceOf(address account) external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IBASICCALCULATOR {
    function add(uint256 a, uint256 b) external pure returns (uint256);
    function subtract(uint256 a, uint256 b) external pure returns (uint256);
}

contract SecurityBank is ReentrancyGuard {
    // using SafeERC20 for IERC20;

    address private CALCULATOR_ADDRESS = 0x6619F0698600AFC2FA151ddf1f03e0E8FB7808cC;

    address private TOKEN_ADDRESS = 0xD9C3016ed1f387335ff2fE4FcAF04122F168D15d;

    IBASICCALCULATOR  BCalc = IBASICCALCULATOR(CALCULATOR_ADDRESS);
    IERC20  WRK_TOKEN = IERC20(TOKEN_ADDRESS);

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
    function deposit(uint256 amount) public nonReentrant {
        require(amount > 0, "Deposit must be greater than 0");
        
        // WRK_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        require(WRK_TOKEN.transferFrom(msg.sender, address(this), amount), "Error in token transfer");

        uint256 newBalance = BCalc.add(balances[msg.sender], amount);
        balances[msg.sender] =  newBalance;

        emit DepositMade(msg.sender, amount);
    }

    // Withdraw 
    function withdraw(uint256 amount) public nonReentrant {
        require(amount <= balances[msg.sender], "Insufficient Balance");

        uint256 newBalance = BCalc.subtract(balances[msg.sender], amount);
        balances[msg.sender] = newBalance;

        // WRK_TOKEN.safeTransfer(msg.sender, amount);
        require(WRK_TOKEN.transfer(msg.sender, amount), "Error in token transfer");

        emit WithdrawalMade(msg.sender, amount);
    }

    // balance
    function balance(address account) public view returns(uint256) {
        return balances[account];
    }

    // Increase user balance
    function creditAccount(address account, uint256 amount) public onlyOwner {
        require(account != address(0), "Cannot credit the zero address");

        uint256 newBalance = BCalc.add(balances[account], amount);
        balances[account] = newBalance;
    }
}