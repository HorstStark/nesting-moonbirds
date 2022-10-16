// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../IFlashClaimReceiver.sol";
import "./IAirdrop.sol";

contract FlashClaimMock is IFlashClaimReceiver, ERC721Holder {
    address public immutable moonbirds;
    address public immutable airdropAddress;

    constructor(address moonbirds_, address airdropAddress_) {
        moonbirds = moonbirds_;
        airdropAddress = airdropAddress_;
    }

    function executeOperation(
        uint256[] calldata tokenIds,
        address initiator,
        address operator,
        bytes calldata params
    ) external override returns (bool) {
        params;

        require(initiator != address(0));
        require(operator != address(0));

        for (uint256 i = 0; i < tokenIds.length; i++) {
            IAirdrop(airdropAddress).claimRewards(tokenIds[i], initiator);

            IERC721(moonbirds).approve(operator, tokenIds[i]);
        }

        return true;
    }

}