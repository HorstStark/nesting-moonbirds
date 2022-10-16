// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10 <0.9.0;

interface IAirdrop {
    function claimRewards(uint256 tokenId, address to) external;
}