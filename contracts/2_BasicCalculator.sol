// SPDX-License-Identifier: MIT

pragma solidity 0.8.2;

/**
 * @title BasicCalculator
 * @dev Implements basic calculator
 */

contract BasicCalculator {

    string name = "Calculator";

    /**
    * @dev Adds two numbers
    * @param a First number
    * @param b Second number
    * @return Sum of 'a' and 'b'
    */
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        uint256 result = a + b;
        return result;
    }

    /**
    * @dev Subtract one Second number from first number
    * @param a First number
    * @param b Second number
    * @return Difference of 'a' and 'b'
    */
    function subtract(uint256 a, uint256 b) public pure returns (uint256) {
        
        require(a >= b, "First number must be greater than the second number");

        uint256 result = a - b;
        return result;
    }

    /**
    * @dev Multiply two numbers together
    * @param a First number
    * @param b Second number
    * @return Product of 'a' and 'b'
    */
    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        uint256 result = a * b;
        return result;
    }

    /**
    * @dev Divide First number by Second number
    * @param a First number
    * @param b Second number
    * @return Division of 'a' and 'b'
    */
    function divide(uint256 a, uint256 b) public pure returns (uint256) {

        require(b != 0, "Cannot divide by Zero");

        uint256 result = a / b;
        return result;
    }

    function setName(string memory _name) public returns (bool) {
        name = _name;
        return true;
    }
    function getName() public view returns (string memory) {
        return name;
    }
}
