import { BigNumber, ethers } from "ethers";
import {
	Dapp,
	DeployedContracts,
	FullDeploymentType,
	SingleDeploymentType,
} from "../Dapp";
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// CHECK ERC20 PROTOTYPE AND
// "NUMBER TO UINT CONSIDERING DECIMALS NUMBERS"
// OF STANDARD METHODS

// AKA HUMAN READY NUMBERS FOR STANDARD TOKEN METHODS
// e.g. 0.0000000000000001 => 1

// ONLY DO THIS ON WRITES

const erc20StandardConvertInts = [
	"allowance",
	"approve",
	"balanceOf", // do not convert
	"decreaseAllowance",
	"decimals",
	"increaseAllowance",
	"totalSupply",
	"transfer",
	"transferFrom",
	"mint", // convert
	"burn", // convert
	"burnFrom",
];

type Write = ethers.providers.TransactionResponse;
type Read = ethers.BigNumber | string;

export async function genericTransactionHandler(
	contract: ethers.Contract,
	method: string,
	...args: any[]
) {
	const that = this as Dapp;
	that._dismissTransactionError();
	// @ts-ignore
	console.log({ arguments });

	const deploymentAll = that.state.deployment as FullDeploymentType;
	const deploymentSingle = deploymentAll[
		contract.address
	] as SingleDeploymentType;

	if (erc20StandardConvertInts.includes(method)) {
		const abi = deploymentSingle.abi;
		args = humanizeBigInts(abi, args);
	}

	const contractsAll = that.state.contracts as DeployedContracts;
	const contractSingle = contractsAll[contract.address] as ethers.Contract;

	const methodResponse = (await contractSingle[method].apply(this, [
		...args,
	])) as Write & Read;

	try {
		if ((methodResponse as Write).hash) {
			// WRITING ("SEND")
			return await writingToChain(methodResponse, that); // convert to ether
		} else {
			// READING ("CALL")
			return methodResponse.toString(); // convert to ether
		}
	} catch (error) {
		if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
			return;
		}
		console.error(error);
		that.setState({ errors: { transaction: error } });
		return error;
	} finally {
		that.setState({ transaction: null });
	}
}

async function writingToChain(
	methodResponse:
		| (ethers.providers.TransactionResponse & string)
		| (ethers.providers.TransactionResponse & BigNumber),
	that: Dapp
) {
	that.setState({ transaction: methodResponse.hash });
	const receipt = await methodResponse.wait();
	if (receipt.status === 0) {
		throw new Error("Transaction failed");
	}
	return receipt;
}

function humanizeBigInts(abi, args: any[]) {
	// HUMANS PROBABLY DIDN'T MEAN
	// 0000000000000000001
	// AND PROBABLY MEANT
	// 1

	return args.map((arg: any) => {
		if (ethers.BigNumber.isBigNumber(arg)) {
			return parseInt(convertWeiToEth(arg));
		} else {
			return arg;
		}
	});
}

// function robotizeBigInts(args: any[]) {
// 	// ROBOTS PROBABLY MEAN
// 	// 0000000000000000001
// 	// NOT
// 	// 1
// 	return args.map((arg: any) => {
// 		if (ethers.BigNumber.isBigNumber(arg)) {
// 			return parseInt(convertEthToWei(arg));
// 		} else {
// 			return arg;
// 		}
// 	});
// }

function convertWeiToEth(number: BigNumber) {
	return ethers.utils.formatUnits(number, "wei");
}
// function convertEthToWei(number: BigNumber) {
// 	return ethers.utils.formatUnits(number, "eth");
// }
