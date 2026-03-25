import hardhat from 'hardhat';

const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying CredentialRegistry with account:', deployer.address);

  const ContractFactory = await ethers.getContractFactory('CredentialRegistry');
  const contract = await ContractFactory.deploy(deployer.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log('CredentialRegistry deployed at:', address);
  console.log('Owner:', deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
