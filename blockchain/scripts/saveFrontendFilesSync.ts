import { Contract } from "ethers";
import fs from "fs-extra-promise";
import { artifacts } from "hardhat";
import path from "path";

// WE ALSO SAVE THE CONTRACT'S ARTIFACTS AND ADDRESS IN THE FRONTEND DIRECTORY
const frontendContractsDirectory = path.join(__dirname, `..`, `..`, `frontend`, `src`, `contracts`);
const contractAddressJsonFileName = "contract-address.json";
const fullPathToJson = path.join(frontendContractsDirectory, contractAddressJsonFileName);

export async function saveFrontendFilesSync(contract: Contract, contractArtifactFileName: string) {
	if (!(await fs.existsAsync(frontendContractsDirectory))) {
		await fs.mkdirAsync(frontendContractsDirectory);
	}

	const contractAddressJson = JSON.stringify({ Contract: contract.address });
	console.log(`writing "${contractAddressJson}" to "${fullPathToJson}"`);
	await fs.writeFileAsync(fullPathToJson, contractAddressJson, { encoding: "utf8", flag: "w" });
	const contractArtifact = await artifacts.readArtifact(path.parse(contractArtifactFileName).name);
	const fullPathToArtifactJson = path.join(frontendContractsDirectory, contractArtifactFileName);
	console.log(`writing "{contractArtifact}" to "${fullPathToArtifactJson}"`);
	await fs.writeFileAsync(fullPathToArtifactJson, JSON.stringify(contractArtifact));
}
