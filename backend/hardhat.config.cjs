require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const rawPrivateKey = process.env.PRIVATE_KEY || process.env.TRUSTVAULT_SIGNER_PRIVATE_KEY || '';
const normalizedPrivateKey = rawPrivateKey.replace(/^0x/, '');
const accounts = /^[a-fA-F0-9]{64}$/.test(normalizedPrivateKey)
  ? [`0x${normalizedPrivateKey}`]
  : [];

module.exports = {
  solidity: '0.8.24',
  networks: {
    mumbai: {
      url: process.env.BLOCKCHAIN_RPC_URL || process.env.POLYGON_MUMBAI_RPC_URL || '',
      accounts
    }
  }
};
