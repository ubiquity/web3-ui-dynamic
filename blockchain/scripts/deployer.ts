import "@nomiclabs/hardhat-ethers";
import { deployments, ethers, getNamedAccounts } from "hardhat";

const { deploy } = deployments;
const provider = ethers.provider;

export async function deployer() {
	let admin;
	let secondAccount;

	[admin, secondAccount] = await ethers.getSigners();

	const { sablier } = await getNamedAccounts();

	const BondingShare = await deploy("BondingShare", {
		from: admin.address,
	});

	const bondingShare = new ethers.Contract(BondingShare.address, BondingShare.abi, provider);

	// const Manager = await deploy("UbiquityAlgorithmicDollarManager", {
	// 	from: admin.address,
	// 	args: [admin.address],
	// });
	// const manager = new ethers.Contract(Manager.address, Manager.abi, provider);

	// await manager.connect(admin).setBondingShareAddress(bondingShare.address);

	// const UAD = await deploy("UbiquityAlgorithmicDollar", {
	// 	from: admin.address,
	// });
	// const uAD = new ethers.Contract(UAD.address, UAD.abi, provider);

	// await uAD.connect(admin).mint(manager.address, ethers.utils.parseEther("10000"));

	// await manager.connect(admin).setuADTokenAddress(uAD.address);

	// const Bonding = await deploy("Bonding", {
	// 	from: admin.address,
	// 	args: [manager.address, sablier],
	// });

	// const bonding = new ethers.Contract(Bonding.address, Bonding.abi, provider);

	// await bondingShare.connect(admin).grantRole(ethers.utils.id("MINTER_ROLE"), bonding.address);

	return [{ name: "BondingShare", contract: bondingShare }];



	// const contractCtor = await ethers.getContractFactory("SBToken");
	// const big1000 = ethers.utils.parseEther("1000");
	// const token = await contractCtor.deploy(big1000).catch(async () => {
	// 	console.warn(`failed to deploy contract, attempting to deploy again with no parameters`);
	// 	return await contractCtor.deploy();
	// });

	// // console.log("Token address:", token.address);
	// return await token.deployed();

}
