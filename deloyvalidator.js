// scripts/deployValidator.js
const hre = require("hardhat");

async function main() {
    const Validator = await hre.ethers.getContractFactory("EmptyValidator");
    const validator = await Validator.deploy();
    await validator.waitForDeployment();

    console.log("Validator deployed at:", await validator.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});