import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import fs from "fs";
// import { DeployFunction } from "hardhat-deploy/types";
import hre, { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployer } from "./deployer";

async function main(hre: HardhatRuntimeEnvironment) {
	if (network.name === "hardhat") {
		networkIsHardhat();
	}
	let protocolData = {};
	const deployedContracts = await deployer();
	for (const { contractName, contractAddress } of deployedContracts) {
		const contractArtifact = JSON.parse((await fs.promises.readFile(`./blockchain/artifacts/contracts/${contractName}.sol/${contractName}.json`)).toString());
		protocolData[contractAddress] = contractArtifact;
	}
	await fs.promises.writeFile("./deploy-results.json", JSON.stringify(protocolData));
}

main(hre)
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

function networkIsHardhat() {
	console.warn("You are trying to deploy a contract to the Hardhat Network, which" + "gets automatically created and destroyed every time. Use the Hardhat" + " option '--network localhost'");
}
