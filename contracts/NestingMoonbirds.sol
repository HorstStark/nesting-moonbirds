// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Proxy.sol";
import "./IMoonbirds.sol";
import "./IFlashClaimReceiver.sol";

contract NestingMoonbirds is Ownable, ERC721, ReentrancyGuard, Proxy {
    IMoonbirds public moonbirds;

    // claim functions delegate to implementation contract 
    address public airdropDelegator;

    event Nest(address indexed sender, uint256 indexed tokenId);
    event Unnest(address indexed sender, uint256 indexed tokenId);
    event MoveIn(address indexed sender, uint256 indexed tokenId);
    event MoveOut(address indexed sender, uint256 indexed tokenId);
    event SetAirdropDelegator(address indexed delegator);
    event FlashClaim(address indexed receiver, address indexed sender, uint256 indexed tokenId);

    constructor(
        string memory name_,
        string memory symbol_,
        address moonbirds_
    ) ERC721(name_, symbol_) Ownable() ReentrancyGuard() {
        moonbirds = IMoonbirds(moonbirds_);
    }

    function nest(uint256 tokenId) external {
        (bool nesting, , ) = moonbirds.nestingPeriod(tokenId);
        require(!nesting, "ONLY_NOT_NESTING");

        moonbirds.safeTransferFrom(_msgSender(), address(this), tokenId);

        uint256[] memory tokenIds = new uint256[](1);
        moonbirds.toggleNesting(tokenIds);

        _mint(_msgSender(), tokenId);

        emit Nest(_msgSender(), tokenId);
    }

    function unnest(uint256 tokenId) external {
        moonbirds.safeTransferFrom(address(this), _msgSender(), tokenId);

        uint256[] memory tokenIds = new uint256[](1);
        moonbirds.toggleNesting(tokenIds);

        _burn(tokenId);

        emit Unnest(_msgSender(), tokenId);
    }

    function moveIn(uint256 tokenId) external {
        (bool nesting, , ) = moonbirds.nestingPeriod(tokenId);
        require(nesting, "ONLY_NESTING");

        moonbirds.safeTransferWhileNesting(_msgSender(), address(this), tokenId);

        _mint(_msgSender(), tokenId);

        emit MoveIn(_msgSender(), tokenId);
    }

    function moveOut(uint256 tokenId) external {
        moonbirds.safeTransferWhileNesting(address(this), _msgSender(), tokenId);

        _burn(tokenId);

        emit MoveOut(_msgSender(), tokenId);
    }

    function setAirdropDelegator(address delegator) external onlyOwner {
        airdropDelegator = delegator;
        
        emit SetAirdropDelegator(delegator);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return moonbirds.tokenURI(tokenId);
    }

    // claim airdrop
    function flashClaim(
        address receiverAddress,
        uint256[] calldata tokenIds,
        bytes calldata params
    ) external nonReentrant {
        uint256 i;
        IFlashClaimReceiver receiver = IFlashClaimReceiver(
            receiverAddress
        );
        // receiver contract may reentry mint, burn, flashclaim again

        // step 1: moving moonbirds forward to receiver contract
        for (i = 0; i < tokenIds.length; i++) {
            moonbirds.safeTransferWhileNesting(
                address(this),
                receiverAddress,
                tokenIds[i]
            );
        }

        // setup 2: execute receiver contract, doing something like airdrop
        require(
            receiver.executeOperation(
                tokenIds,
                _msgSender(),
                address(this),
                params
            ),
            "FLASHCLAIM_EXECUTOR_ERROR"
        );

        // setup 3: moving moonbirds backward from receiver contract
        for (i = 0; i < tokenIds.length; i++) {
            moonbirds.safeTransferWhileNesting(
                receiverAddress,
                address(this),
                tokenIds[i]
            );
            emit FlashClaim(
                receiverAddress,
                _msgSender(),
                tokenIds[i]
            );
        }
    }

    function _implementation() internal override view virtual returns (address) {
        return airdropDelegator;
    }

}
