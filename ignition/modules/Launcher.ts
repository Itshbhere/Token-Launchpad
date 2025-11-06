import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenLauncherModule", (m) => {
  // Get parameters from module parameters or use defaults
  const name = m.getParameter("name", "Token Launchpad");
  const symbol = m.getParameter("symbol", "TLP");
  const initialSupply = m.getParameter("initialSupply", 1000000n);

  const tokenLauncher = m.contract("TokenLauncher", [
    name,
    symbol,
    initialSupply,
  ]);

  return { tokenLauncher };
});
