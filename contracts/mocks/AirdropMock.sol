// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IAirdrop.sol";

contract AirdropMock is ERC20, IAirdrop {
    address public immutable moonbirds;

    constructor(address moonbirds_) ERC20('Ape Coin', 'APE') {
        moonbirds = moonbirds_;
    }

    function claimRewards(uint256 tokenId, address to) external override {
        require(IERC721(moonbirds).ownerOf(tokenId) == _msgSender(), '');

        _mint(to, 10 ether);
    }
}