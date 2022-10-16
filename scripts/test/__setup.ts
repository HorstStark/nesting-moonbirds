import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat';
import { setupUser, setupUsers } from '../helpers/utils';

export const setup = deployments.createFixture(async () => {
    await deployments.fixture(['Test']);

    const contracts: any = {
        NestingMoonbirds: await ethers.getContract('NestingMoonbirds'),
        Moonbirds: await ethers.getContract('Moonbirds'),
        FlashClaimMock: await ethers.getContract('FlashClaimMock'),
        AirdropMock: await ethers.getContract('AirdropMock'),
    };

    const users = await setupUsers(await getUnnamedAccounts(), contracts);
    const { deployer, user001, user002, user003 } = await getNamedAccounts();

    const ENV = {
        ...contracts,
        users,
        deployer: await setupUser(deployer, contracts),
        user001: await setupUser(user001, contracts),
        user002: await setupUser(user002, contracts),
        user003: await setupUser(user003, contracts),
    };
    return ENV;
});