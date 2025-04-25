const hre = require("hardhat");

async function main() {
  const name = "CensorableToken";
  const symbol = "CNSR";
  const initialSupply = hre.ethers.parseUnits("100", 18); // 100 tokens
  const initialOwner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // ⚠️ remplace par ton adresse Metamask !!

  console.log("📄 Deploying with params:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Initial Supply:", initialSupply.toString());
  console.log("Initial Owner:", initialOwner);

  const Token = await hre.ethers.getContractFactory("CensorableToken");
  const token = await Token.deploy(name, symbol, initialSupply, initialOwner);
  console.log("🚀 Deploy transaction sent...");

  await token.deployed();
  console.log("✅ Contract deployed at:", token.address);
}

main().catch((error) => {
  console.error("❌ Deployment FAILED:", error);
  process.exitCode = 1;
});
