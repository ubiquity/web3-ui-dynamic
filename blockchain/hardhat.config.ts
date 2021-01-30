import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import * as dotenv from "dotenv";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
	console.log({ hre });
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
// import "./tasks/faucet";

export default {
	networks: {
		hardhat: {
			chainId: 31337,
			accounts: [
        {
          privateKey: process.env.TREASURY_PRIV_KEY,
          balance: "10000000000000000000000",
        },
        {
          privateKey: process.env.SECOND_ACC_PRIV_KEY,
          balance: "10000000000000000000000",
        },
      ],
		},
	},
	solidity: {
		compilers: [{ version: "0.7.6" }, { version: "0.6.6" }],
	},
};
