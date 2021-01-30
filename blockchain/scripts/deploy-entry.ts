import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
// import { DeployFunction } from "hardhat-deploy/types";
import hre, { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { deployer } from "./deployer";
import { saveFrontendFilesSync } from "./saveFrontendFilesSync";

async function main(hre: HardhatRuntimeEnvironment) {
	if (network.name === "hardhat") {
		networkIsHardhat();
	}
	const deployedContracts = await deployer();
	for (const deployed of deployedContracts) {
		return await saveFrontendFilesSync(deployed.contract, `${deployed.name}.json`);
	}
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
