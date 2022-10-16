// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10 <0.9.0;

interface IFlashClaimReceiver {
    function executeOperation(
        uint256[] calldata tokenIds,
        address initiator,
        address operator,
        bytes calldata params
    ) external returns (bool);
}
