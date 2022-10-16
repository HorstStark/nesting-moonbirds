import { Contract, ContractTransaction } from 'ethers';
// @ts-ignore
import { ethers } from 'hardhat';
import crypto from 'crypto';

const { BigNumber: BN } = require('@ethersproject/bignumber');

export async function setupUsers<T extends { [contractName: string]: Contract }>(
    addresses: string[],
    contracts: T
): Promise<({ address: string } & T)[]> {
    const users: ({ address: string } & T)[] = [];
    for (const address of addresses) {
        users.push(await setupUser(address, contracts));
    }
    return users;
}

export async function setupUser<T extends { [contractName: string]: Contract }>(address: string, contracts: T): Promise<{ address: string } & T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = { address };
    for (const key of Object.keys(contracts)) {
        user[key] = contracts[key].connect(await ethers.getSigner(address));
    }

    user.gasSpent = new BN.from(0);
    user.getETHBalance = async () => {
        return await ethers.provider.getBalance(address);
    };

    return user as { address: string } & T;
}

export const waitForTx = async (tx: ContractTransaction) => await tx.wait(1);

export const getETHBalance = async (address: string) => {
    return await ethers.provider.getBalance(address);
};

export const increaseTime = async (secondsToIncrease: number) => {
    await ethers.provider.send('evm_increaseTime', [secondsToIncrease]);
    await ethers.provider.send('evm_mine', []);
};

// Workaround for time travel tests bug: https://github.com/Tonyhaenn/hh-time-travel/blob/0161d993065a0b7585ec5a043af2eb4b654498b8/test/test.js#L12
export const advanceTimeAndBlock = async function (forwardTime: number) {
    const currentBlockNumber = await ethers.provider.getBlockNumber();
    const currentBlock = await ethers.provider.getBlock(currentBlockNumber);

    if (currentBlock === null) {
        /* Workaround for https://github.com/nomiclabs/hardhat/issues/1183*/
        await ethers.provider.send('evm_increaseTime', [forwardTime]);
        await ethers.provider.send('evm_mine', []);
        //Set the next blocktime back to 15 seconds
        await ethers.provider.send('evm_increaseTime', [15]);
        return;
    }
    const currentTime = currentBlock.timestamp;
    const futureTime = currentTime + forwardTime;
    await ethers.provider.send('evm_setNextBlockTimestamp', [futureTime]);
    await ethers.provider.send('evm_mine', []);
};

export const advanceBlocks = async function (blockNumber: number) {
    for (let i = 0; i < blockNumber; i++) {
        await ethers.provider.send('evm_mine', []);
    }
}

export const getTxCost = async (tx: any) => {
    const receipt = await tx.wait();
    return tx.gasPrice.mul(receipt.gasUsed);
};

export const getTxGasUsed = async (tx: any) => {
    const receipt = await tx.wait();
    return receipt.gasUsed;
};

export const getCurrentBlockAndTimestamp = async () => {
    const currentBlockNumber = await ethers.provider.getBlockNumber();
    const currentBlock = await ethers.provider.getBlock(currentBlockNumber);
    return {
        timestamp: currentBlock.timestamp,
        blockNumber: currentBlock.number,
    };
};

export function randomAddress() {
    let id = crypto.randomBytes(32).toString('hex');
    let privateKey = "0x" + id;
    let wallet = new ethers.Wallet(privateKey);
    return wallet.address;
}
