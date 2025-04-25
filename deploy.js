// scripts/deploy.js
require("dotenv").config();                     // charge automatiquement .env
const hre = require("hardhat");

async function main() {
  // 1️⃣ Récupère le deployer
  const [deployer] = await hre.ethers.getSigners();

  // 2️⃣ Lit l'adresse du validator depuis .env
  const validator = process.env.DAPP_VALIDATOR_ADDRESS;
  if (!validator) {
    throw new Error(
      "🚨 DAPP_VALIDATOR_ADDRESS n'est pas défini dans .env — vérifie ta variable"
    );
  }

  console.log("Deploying from:", deployer.address);
  console.log("Validator address:", validator);

  // 3️⃣ Prépare la factory du contrat
  const Censorable = await hre.ethers.getContractFactory("CensorableToken");

  // 4️⃣ Définis la quantité à minter pour l’owner (ici 100 tokens)
  const initialSupply = hre.ethers.parseEther("100");

  // 5️⃣ Déploie le contrat
  const token = await Censorable.deploy(
    "CensorToken",      // nom
    "CTK",              // symbole
    initialSupply,      // supply pour l’owner
    deployer.address,   // adresse owner
    validator           // adresse validator (DApp)
  );

  // 6️⃣ Attends la confirmation de déploiement
  await token.waitForDeployment();

  console.log("✅ CensorableToken déployé à:", token.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur de déploiement :", error);
    process.exit(1);
  });
