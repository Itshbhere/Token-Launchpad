import { network } from "hardhat";

interface DeployParams {
  name: string;
  symbol: string;
  initialSupply?: bigint;
  network?: string;
}

export async function deployToken(params: DeployParams) {
  const { name, symbol, initialSupply = 1000000n, network: networkName } = params;

  try {
    // Connect to the network (default to hardhatMainnet for local testing)
    const targetNetwork = networkName || "hardhatMainnet";
    
    // Connect to the network - Hardhat will use the config from hardhat.config.ts
    const { ethers } = await network.connect({
      network: targetNetwork,
    });

    // Get the signer
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying with account: ${deployer.address}`);

    // Get the contract factory
    const TokenLauncher = await ethers.getContractFactory("TokenLauncher");

    // Deploy the contract (initialSupply is already in the correct format)
    console.log(`Deploying TokenLauncher with name: ${name}, symbol: ${symbol}, supply: ${initialSupply}`);
    const tokenLauncher = await TokenLauncher.deploy(name, symbol, initialSupply);

    // Wait for deployment
    await tokenLauncher.waitForDeployment();
    const address = await tokenLauncher.getAddress();

    console.log(`TokenLauncher deployed to: ${address}`);

    return {
      success: true,
      address,
      name,
      symbol,
      transactionHash: tokenLauncher.deploymentTransaction()?.hash,
    };
  } catch (error: any) {
    console.error("Deployment error:", error);
    return {
      success: false,
      error: error.message || "Unknown deployment error",
    };
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const name = process.argv[2] || "Token Launchpad";
  const symbol = process.argv[3] || "TLP";
  const initialSupply = BigInt(process.argv[4] || "1000000");

  deployToken({ name, symbol, initialSupply })
    .then((result) => {
      if (result.success) {
        console.log(`Token deployed successfully!`);
        console.log(`Address: ${result.address}`);
        console.log(`Name: ${result.name}`);
        console.log(`Symbol: ${result.symbol}`);
      } else {
        console.error(`Deployment failed: ${result.error}`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}

