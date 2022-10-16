import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const Moonbirds = await ethers.getContract('Moonbirds');
    const AirdropMock = await ethers.getContract('AirdropMock');

    await deploy('FlashClaimMock', {
        from: deployer,
        args: [Moonbirds.address, AirdropMock.address],
        log: true,
    });
};

export default func;
func.tags = ['FlashClaimMock'];
func.dependencies = ['Moonbirds', 'AirdropMock'];
