import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const Moonbirds = await ethers.getContract('Moonbirds');

    await deploy('NestingMoonbirds', {
        from: deployer,
        args: ['Nesting Moon Birds', 'NESTINGMOONBIRDS', Moonbirds.address],
        log: true,
    });
};

export default func;
func.tags = ['NestingMoonbirds.hardhat'];
func.dependencies = ['Moonbirds'];
