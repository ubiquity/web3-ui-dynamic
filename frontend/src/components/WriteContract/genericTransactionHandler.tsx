import { BigNumber, ethers } from "ethers";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../Dapp";

// CHECK ERC20 PROTOTYPE AND
// "NUMBER TO UINT CONSIDERING DECIMALS NUMBERS"
// OF STANDARD METHODS

// AKA HUMAN READY NUMBERS FOR STANDARD TOKEN METHODS
// e.g. 0.0000000000000001 => 1

// ONLY DO THIS ON WRITES

const erc20Intercepts = [
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

export async function genericTransactionHandler(method: string, ...args: any[]) {
	try {
		this._dismissTransactionError();
		let newArgs = [] as any[];
		for (let index in args) {
			newArgs = preprocessor(args, index, newArgs, method);
		}

		const methodResponse = (await this._contract[method].apply(this, [...newArgs])) as Write & Read;

		// WRITING (SEND)
		if ((methodResponse as Write).hash) {
			this.setState({ txBeingSent: methodResponse.hash });
			const receipt = await methodResponse.wait();
			if (receipt.status === 0) {
				throw new Error("Transaction failed");
			}
			return receipt; // convert to ether
			// READING (CALL)
		} else {
			return methodResponse.toString(); // convert to ether
		}
	} catch (error) {
		if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
			return;
		}
		console.error(error);
		this.setState({ transactionError: error });
		return error;
	} finally {
		this.setState({ txBeingSent: undefined });
	}
}

function preprocessor(args: any[], index: string, newArgs: any[], method: string) {
	if (!erc20Intercepts.includes(method)) {
		return newArgs;
	}

	let arg = args[index];
	// console.log(arg);
	if (ethers.BigNumber.isBigNumber(arg)) {
		newArgs[index] = parseInt(convertWeiToEth(arg)); // 1 => 0.0000000001
		// parseInt(convertEthToWei(arg)) // 0.000001 => 1
	} else {
		newArgs[index] = arg;
	}
	console.log({ newArgs });
	return newArgs;
}

function convertWeiToEth(number: BigNumber) {
	return ethers.utils.formatUnits(number, "wei");
}
