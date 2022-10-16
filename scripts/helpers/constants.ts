import { parseEther } from 'ethers/lib/utils';
import { getCurrentBlockAndTimestamp } from './utils';

export const ONE_HOUR = 3600;
export const ONE_DAY = 86400;
export const ONE_WEEK = 604800;
export const ONE_MONTH = 2592000;
export const ONE_YEAR = 31536000;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// eth
export const ONE_ETH = parseEther('1');

export const NOW = () => parseInt(Date.now() / 1000 + '');

export const BLOCK_TIMESTAMP = async () => (await getCurrentBlockAndTimestamp()).timestamp
