require("@nomicfoundation/hardhat-toolbox");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "notunima",
    solidity: "0.8.20", // must match your contract's pragma
    networks: {
    notunima: {
        url: "http://134.155.50.125:3000/",
        accounts: [`0x${process.env.METAMASK_1_PRIVATE_KEY}`], // ensure 0x prefix
        },
    },
};