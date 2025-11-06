import hre from "hardhat";

async function verifyContract(address: string, constructorArgs: any[]) {
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments: constructorArgs,
    });
    console.log(`Contract verified at ${address}`);
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log(`Contract already verified at ${address}`);
    } else {
      console.error(`Verification failed for ${address}:`, error.message);
    }
  }
}

// This script can be run after deployment to verify the contract
// Usage: npx hardhat run scripts/verify.ts --network <network>
// Or import and use in other scripts
export { verifyContract };

