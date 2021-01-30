import { BigNumber, ethers } from "ethers";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../Dapp";

export async function genericTransactionHandler(method: string, ...args) {
	try {
		//@ts-ignore
		this._dismissTransactionError();
		let newArgs = [] as any[];
		for (let index in args) {
			newArgs = preprocessor(args, index, newArgs);
		} //@ts-ignore
		const tx = await this._contract[method].apply(this, [...newArgs]); //@ts-ignore

		if (!tx.wait) {
			// READ "SEND" VS WRITE "CALL"
			// @ts-ignore
			return (this.setState.readData[method] = tx.toString());
		} else {
			//@ts-ignore
			this.setState({ txBeingSent: tx.hash });

			const receipt = await tx.wait();
			if (receipt.status === 0) {
				throw new Error("Transaction failed");
			}
			return receipt;
		}
	} catch (error) {
		if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
			return;
		}

		console.error(error);
		//@ts-ignore
		this.setState({ transactionError: error });
	} finally {
		//@ts-ignore
		this.setState({ txBeingSent: undefined });
	} //@ts-ignore
	return error;
}

function preprocessor(args: any[], index: string, newArgs: any[]) {
	let arg = args[index];
	console.log(arg);

	if (ethers.BigNumber.isBigNumber(arg)) {
		newArgs[index] = convertWeiToEth(arg);

		console.log(newArgs[index]);
	} else {
		newArgs[index] = arg;
	}
	return newArgs;
}

function convertWeiToEth(number: BigNumber) {
	return ethers.utils.formatUnits(number, "wei");
	// ethers.BigNumber.from(number);
}
