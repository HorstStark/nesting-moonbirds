import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer, proof, beneficiary, royaltyReceiver } = await getNamedAccounts();

    await deploy('Moonbirds', {
        from: deployer,
        args: ['Moon Birds', 'MOONBIRDS', proof, beneficiary, royaltyReceiver],
        log: true,
    });
};

export default func;
func.tags = ['Moonbirds'];
