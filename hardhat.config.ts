import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import '@typechain/ethers-v5';
import 'hardhat-gas-reporter';
import 'hardhat-abi-exporter';
import 'hardhat-contract-sizer';
import 'hardhat-deploy';
import 'hardhat-storage-layout';
import 'solidity-coverage';

dotenv.config();

const TEST_ACCOUNTS_KEYS: any = [
    process.env.TEST_ACCOUNT_0_KEY,
    process.env.TEST_ACCOUNT_1_KEY,
    process.env.TEST_ACCOUNT_2_KEY,
    process.env.TEST_ACCOUNT_3_KEY,
    process.env.TEST_ACCOUNT_4_KEY,
    process.env.TEST_ACCOUNT_5_KEY,
    process.env.TEST_ACCOUNT_6_KEY,
];
const TEST_ACCOUNTS_HARDHAT: any = [
    {
        privateKey: process.env.TEST_ACCOUNT_0_KEY,
        balance: '115792089237316195423570985008687907', // uint256 max
    },
    {
        privateKey: process.env.TEST_ACCOUNT_1_KEY,
        balance: '100000000000000000000',
    },
    {
        privateKey: process.env.TEST_ACCOUNT_2_KEY,
        balance: '100000000000000000000',
    },
    {
        privateKey: process.env.TEST_ACCOUNT_3_KEY,
        balance: '100000000000000000000',
    },
    {
        privateKey: process.env.TEST_ACCOUNT_4_KEY,
        balance: '100000000000000000000',
    },
    {
        privateKey: process.env.TEST_ACCOUNT_5_KEY,
        balance: '100000000000000000000',
    },
    {
        privateKey: process.env.TEST_ACCOUNT_6_KEY,
        balance: '100000000000000000000',
    },
];
const TEST_ACCOUNTS_NAMED = {
    deployer: 0,
    user001: 1,
    user002: 2,
    user003: 3,
    proof: 4,
    beneficiary: 5,
    royaltyReceiver: 6
};

const config: HardhatUserConfig = {
    namedAccounts: TEST_ACCOUNTS_NAMED,
    networks: {
        hardhat: {
            allowUnlimitedContractSize: false,
            accounts: TEST_ACCOUNTS_HARDHAT,
            tags: ['hardhat'],
            forking: process.env.HARDHAT_FORKING_URL
                ? {
                      url: process.env.HARDHAT_FORKING_URL,
                      blockNumber: Number(process.env.HARDHAT_FORKING_BLOCKNUMBER),
                  }
                : undefined,
        },
        ganache: {
            url: 'http://127.0.0.1:7545',
            accounts: { mnemonic: process.env.TEST_MNEMONIC },
            tags: ['ganache'],
        },
        rinkeby: {
            accounts: TEST_ACCOUNTS_KEYS,
            url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
            tags: ['rinkeby'],
        },
        kovan: {
            accounts: TEST_ACCOUNTS_KEYS,
            url: `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
            tags: ['kovan'],
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
            tags: ['mainnet'],
        }
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: false,
        strict: true,
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: 'USD',
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    paths: {
        deploy: 'scripts/deploy',
        tests: 'scripts/test',
        deployments: 'data/deployments',
        cache: 'data/cache',
        artifacts: 'data/artifacts',
        imports: 'imports',
    },
    abiExporter: {
        path: 'data/abi',
        clear: true,
        flat: true,
        except: [],
        spacing: 2,
    },
    solidity: {
        compilers: [
            {
                // Docs for the compiler https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html
                version: '0.8.10',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 2000,
                    },
                    evmVersion: 'london',
                },
            },
        ],
    },
    mocha: {
        timeout: 100000,
    },
    typechain: {
        outDir: './types',
        target: 'ethers-v5',
    },
};

export default config;
