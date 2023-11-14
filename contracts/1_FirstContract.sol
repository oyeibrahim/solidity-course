// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;

contract FirstContract {

    uint256 number;
    string name;

    constructor() {
        number = 60;
        name = "Hello World!";
    }

    function getNumber() public view returns(uint256) {
        return number;
    }

    function getName() public view returns(string memory) {
        return name;
    }

}