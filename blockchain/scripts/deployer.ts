import "@nomiclabs/hardhat-ethers";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import CurveArtifact from "./Curve.json";

const { deploy } = deployments;
const provider = ethers.provider;

interface ContractInfo {
	contractName: string;
	contractAddress: string;
}

export async function deployer(): Promise<Array<ContractInfo>> {
	let admin;

	[admin] = await ethers.getSigners();

	const { sablier, CurveFactory, _3CrvBasePool, _3CrvToken, curveWhaleAddress } = await getNamedAccounts();

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

	const crvToken = new ethers.Contract(_3CrvToken, CurveArtifact.abi, provider);

	await network.provider.request({
		method: "hardhat_impersonateAccount",
		params: [curveWhaleAddress],
	});

	const curveWhale = await ethers.provider.getSigner(curveWhaleAddress);

	await crvToken.connect(curveWhale).transfer(manager.address, ethers.utils.parseEther("10000"));

	await manager.connect(admin).deployStableSwapPool(CurveFactory, _3CrvBasePool, crvToken.address, 10, 4000000);

	const metaPoolAddr = await manager.stableSwapMetaPoolAddress();

	const defaultWindowSize = 86400; // 24 hours
	const defaultGranularity = 24; // 1 hour each

	const TWAPOracle = await deploy("TWAPOracle", {
		from: admin.address,
		args: [metaPoolAddr, defaultWindowSize, defaultGranularity],
	});

	const twapOracle = new ethers.Contract(TWAPOracle.address, TWAPOracle.abi, provider);

	await manager.connect(admin).setTwapOracleAddress(twapOracle.address);

	const Bonding = await deploy("Bonding", {
		from: admin.address,
		args: [manager.address, sablier],
	});
	const bonding = new ethers.Contract(Bonding.address, Bonding.abi, provider);

	await bondingShare.connect(admin).grantRole(ethers.utils.id("MINTER_ROLE"), bonding.address);

	return [
		{ contractName: "BondingShare", contractAddress: bondingShare.address },
		{ contractName: "UbiquityAlgorithmicDollarManager", contractAddress: manager.address },
		{ contractName: "UbiquityAlgorithmicDollar", contractAddress: uAD.address },
		{ contractName: "TWAPOracle", contractAddress: twapOracle.address },
		{ contractName: "Bonding", contractAddress: bonding.address },
	];
}
