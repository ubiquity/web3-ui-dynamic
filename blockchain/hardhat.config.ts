import "@nomiclabs/hardhat-waffle";
import * as dotenv from "dotenv";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { task } from "hardhat/config";
import fsp from "fs-extra-promise";

dotenv.config();

dynamicallyCheckAllEnvVars();

// TODO this only checks this file.
async function dynamicallyCheckAllEnvVars() {
	const file = fsp.readFileSync(__filename, "utf8");
	const process_envs = file.match(/process\.env\.([A-Z]|_)+/gim);
	const results = process_envs.values();

	const rawKeys = [] as string[];
	for (const result of results) {
		rawKeys.push(result.split(`process.env.`).pop());
	}

	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	const uniqueKeys = rawKeys.filter(onlyUnique);
	const processEnvKeys = Object.keys(process.env);
	const errors = [] as string[];
	for (const uniqueKey of uniqueKeys) {
		if (!processEnvKeys.includes(uniqueKey)) {
			errors.push(`unset required environment variable ${uniqueKey}`);
		}
	}
	if (errors.length) {
		console.error(`Error: check .env!`);
		throw new Error(errors.toString());
	}
}

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
	namedAccounts: {
		sablier: "0xA4fc358455Febe425536fd1878bE67FfDBDEC59a",
		USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
		DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
		_3CrvBasePool: "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
		_3CrvToken: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
		CurveFactory: "0xfD6f33A0509ec67dEFc500755322aBd9Df1bD5B8",
		usdDepositerAddress: "0xA79828DF1850E8a3A3064576f380D90aECDD3359",
		curveWhaleAddress: "0x09cabda22B553bA8FFCD2d453078e2fD4017404F",
	},

	networks: {
		hardhat: {
			forking: {
				url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
				blockNumber: 11754488,
			},
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
