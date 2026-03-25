import { ethers } from 'ethers';
import { toBytes32Hash } from './hashing.js';

const DEFAULT_ABI = [
  'function registerCredential(string did, bytes32 credentialHash) returns (bytes32)',
  'function getCredentialHash(string did) view returns (bytes32)'
];

function getConfig() {
  const network = process.env.BLOCKCHAIN_NETWORK || 'polygon-mumbai';
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || process.env.POLYGON_MUMBAI_RPC_URL;
  const contractAddress = process.env.CREDENTIAL_CONTRACT_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY || process.env.TRUSTVAULT_SIGNER_PRIVATE_KEY;
  const strictMode = (process.env.BLOCKCHAIN_STRICT_MODE || 'false').toLowerCase() === 'true';

  return { network, rpcUrl, contractAddress, privateKey, strictMode };
}

function getContractAbi() {
  try {
    if (process.env.CREDENTIAL_CONTRACT_ABI) {
      const parsed = JSON.parse(process.env.CREDENTIAL_CONTRACT_ABI);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    // Fall back to default ABI when env JSON is invalid.
  }
  return DEFAULT_ABI;
}

function ensureReadConfig(config) {
  if (!config.rpcUrl || !config.contractAddress) {
    throw new Error('Blockchain read configuration missing. Set BLOCKCHAIN_RPC_URL and CREDENTIAL_CONTRACT_ADDRESS.');
  }
}

function ensureWriteConfig(config) {
  ensureReadConfig(config);
  if (!config.privateKey) {
    throw new Error('Blockchain write configuration missing. Set PRIVATE_KEY or TRUSTVAULT_SIGNER_PRIVATE_KEY.');
  }
}

function getReadContract() {
  const config = getConfig();
  ensureReadConfig(config);
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const contract = new ethers.Contract(config.contractAddress, getContractAbi(), provider);
  return { contract, config };
}

function getWriteContract() {
  const config = getConfig();
  ensureWriteConfig(config);
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const wallet = new ethers.Wallet(config.privateKey, provider);
  const contract = new ethers.Contract(config.contractAddress, getContractAbi(), wallet);
  return { contract, config };
}

export async function registerCredentialOnBlockchain(did, hashValue) {
  const hashBytes32 = toBytes32Hash(hashValue);
  try {
    const { contract, config } = getWriteContract();
    const tx = await contract.registerCredential(did, hashBytes32);
    const receipt = await tx.wait();

    return {
      success: true,
      network: config.network,
      txHash: receipt?.hash || tx.hash,
      hashOnChain: hashBytes32
    };
  } catch (error) {
    const { strictMode, network } = getConfig();
    if (strictMode) {
      throw error;
    }

    return {
      success: false,
      network,
      txHash: null,
      hashOnChain: hashBytes32,
      error: error.message
    };
  }
}

export async function getCredentialHashFromBlockchain(did) {
  try {
    const { contract } = getReadContract();
    const hash = await contract.getCredentialHash(did);
    return hash && hash !== ethers.ZeroHash ? hash.toLowerCase() : null;
  } catch (error) {
    return null;
  }
}

export async function compareCredentialHashWithBlockchain(did, hashValue) {
  const normalizedHash = toBytes32Hash(hashValue).toLowerCase();
  const blockchainHash = await getCredentialHashFromBlockchain(did);

  if (!blockchainHash) {
    return {
      blockchainVerified: false,
      blockchainHashMatched: false,
      onChainHash: null,
      expectedHash: normalizedHash
    };
  }

  return {
    blockchainVerified: true,
    blockchainHashMatched: blockchainHash === normalizedHash,
    onChainHash: blockchainHash,
    expectedHash: normalizedHash
  };
}
