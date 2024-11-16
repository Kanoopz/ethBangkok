//SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

contract ReadFrom
{
    uint mainValue = 7;
    uint[3] values;

    constructor()
    {
        values[0] = 32;
        values[1] = 893;
        values[2] = 1238;
    }

    function getValue() public view returns(uint)
    {
        return mainValue;
    }

    function getValueFromValues(uint indexParam) public view returns(uint)
    {
        return values[indexParam];
    }
}