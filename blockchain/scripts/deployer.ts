import "@nomiclabs/hardhat-ethers";
import { deployments, ethers } from "hardhat";

const { deploy } = deployments;
const provider = ethers.provider;

export async function deployer() {
	let admin;
	let secondAccount;

	[admin, secondAccount] = await ethers.getSigners();

	const BondingShare = await deploy("BondingShare", {
		from: admin.address,
	});

	const bondingShare = new ethers.Contract(BondingShare.address, BondingShare.abi, provider);

	const Manager = await deploy("UbiquityAlgorithmicDollarManager", {
		from: admin.address,
		args: [admin.address],
	});
	const manager = new ethers.Contract(Manager.address, Manager.abi, provider);

	await manager.connect(admin).setBondingShareAddress(bondingShare.address);

	const UAD = await deploy("UbiquityAlgorithmicDollar", {
		from: admin.address,
	});
	const uAD = new ethers.Contract(UAD.address, UAD.abi, provider);

	await uAD.connect(admin).mint(manager.address, ethers.utils.parseEther("10000"));

	await manager.connect(admin).setuADTokenAddress(uAD.address);

	return [{ name: "BondingShare", contractObj: bondingShare }];
}
