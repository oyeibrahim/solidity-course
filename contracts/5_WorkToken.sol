// SPDX-License-Identifier: MIT

pragma solidity 0.8.2;

interface IERC20 {
    //ERC20 //BEP20

    function totalSupply() external view returns (uint256);

    function decimals() external view returns (uint8);

    function symbol() external view returns (string memory);

    function name() external view returns (string memory);

    function getOwner() external view returns (address);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address _owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Context {
    constructor() {}

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this;
        return msg.data;
    }
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract Work is Context, IERC20, Ownable {
    using SafeMath for uint256;

    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;
    uint8 private _decimals;
    string private _symbol;
    string private _name;

    // Blacklist -----------------------------
    mapping(address => bool) private _isBlacklisted;
    address[] private _blacklisted;

    // ---------------------------------------

    // Tax -----------------------------
    uint256 private _taxPercent = 4;
    mapping(address => bool) private _isExcludedFromTax;

    event ExcludeFromTax(address indexed account, bool isExcluded);

    // ---------------------------------------

    constructor() {
        _name = "Work";
        _symbol = "WRK";
        _decimals = 18;
        // _totalSupply = 100000000000000000000000000; //100 million
        _totalSupply = 100_000_000 * (10 ** 18); //100 million
        _balances[msg.sender] = _totalSupply;

        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function getOwner() external view override returns (address) {
        return owner();
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function symbol() external view override returns (string memory) {
        return _symbol;
    }

    function name() external view override returns (string memory) {
        return _name;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(
        address account
    ) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        _preTransfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(
        address spender,
        uint256 amount
    ) external override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        _preTransfer(sender, recipient, amount);
        _approve(
            sender,
            _msgSender(),
            _allowances[sender][_msgSender()].sub(
                amount,
                "ERC20: transfer amount exceeds allowance"
            )
        );
        return true;
    }

    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) public returns (bool) {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender].add(addedValue)
        );
        return true;
    }

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue
    ) public returns (bool) {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender].sub(
                subtractedValue,
                "ERC20: decreased allowance below zero"
            )
        );
        return true;
    }

    function burn(uint256 amount) public returns (bool) {
        _burn(_msgSender(), amount);
        return true;
    }

    function burnFrom(address owner, uint256 amount) public returns (bool) {
        _burnFrom(owner, amount);
        return true;
    }

    function _preTransfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        // Blacklist -----------------------------
        require(!_isBlacklisted[sender], "BEP20: sender address blacklisted");
        require(
            !_isBlacklisted[recipient],
            "BEP20: transfer to blacklisted address"
        );
        // ---------------------------------------

        bool takeFee = true;
        if (_isExcludedFromTax[sender] || _isExcludedFromTax[recipient]) {
            takeFee = false;
        }

        if (takeFee) {
            if (_taxPercent > 0) {
                uint256 fees = (amount * _taxPercent) / 100;

                amount = amount - fees;

                _transfer(sender, address(this), fees);
            }
        }

        _transfer(sender, recipient, amount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] = _balances[sender].sub(
            amount,
            "ERC20: transfer amount exceeds balance"
        );
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(
            amount,
            "ERC20: burn amount exceeds balance"
        );
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        _approve(
            account,
            _msgSender(),
            _allowances[account][_msgSender()].sub(
                amount,
                "ERC20: burn amount exceeds allowance"
            )
        );
    }

    // Blacklist -----------------------------
    // function blacklistAccount(address account) external onlyOwner {
    //     require(!_isBlacklisted[account], "Account is already blacklisted");
    //     _isBlacklisted[account] = true;
    //     _blacklisted.push(account);
    // }

    // Using array param
    function blacklistAccount(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            address account = accounts[i];

            if (!_isBlacklisted[account]) {
                _isBlacklisted[account] = true;
            } else {
                continue;
            }
        }
    }

    // function removeBlacklist(address account) external onlyOwner {
    //     require(_isBlacklisted[account], "Account is not blacklisted");
    //     for (uint256 i = 0; i < _blacklisted.length; i++) {
    //         if (_blacklisted[i] == account) {
    //             _blacklisted[i] = _blacklisted[_blacklisted.length - 1];
    //             _isBlacklisted[account] = false;
    //             _blacklisted.pop();
    //             break;
    //         }
    //     }
    // }

    // Using array param
    function removeBlacklist(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            address account = accounts[i];

            if (_isBlacklisted[account]) {
                _isBlacklisted[account] = false;
            } else {
                continue;
            }
        }
    }

    function isBlacklisted(address account) external view returns (bool) {
        return _isBlacklisted[account];
    }

    // -------------------------------------------

    // Tax -----------------------------
    function excludeFromTax(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            address account = accounts[i];

            _isExcludedFromTax[account] = true;
            emit ExcludeFromTax(account, true);
        }
    }

    function includeInTax(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            address account = accounts[i];

            _isExcludedFromTax[account] = false;
            emit ExcludeFromTax(account, false);
        }
    }

    function isExcludedFromTax(address account) public view returns (bool) {
        return _isExcludedFromTax[account];
    }

    // -------------------------------------------

    function removeTokens(address token) external onlyOwner {
        require(token != address(0), "Address at Zero");

        IERC20 ERC20Token = IERC20(token);
        uint256 balance = ERC20Token.balanceOf(address(this));
        ERC20Token.transfer(owner(), balance);
    }

    function removeETH() external onlyOwner {
        uint256 amount = address(this).balance;

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(
            success,
            "Unable to send value, recipient may have reverted"
        );
    }
}
