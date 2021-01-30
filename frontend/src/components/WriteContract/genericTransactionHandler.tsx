import { BigNumber, ethers } from "ethers";
import { ERROR_CODE_TX_REJECTED_BY_USER } from "../Dapp";

export async function genericTransactionHandler(method: string, ...args) {
	try {
		//@ts-ignore
		this._dismissTransactionError();
		let newArgs = [] as any[];
		for (let index in args) {
			// console.log({ args });

			newArgs = preprocessor(args, index, newArgs);
			// console.log({ newArgs });
		} //@ts-ignore

		// const provider = this._provider;

		type Write = ethers.providers.TransactionResponse;
		type Read = ethers.BigNumber | string;

		// @ts-ignore
		const methodResponse = (await this._contract[method].apply(this, [...newArgs])) as Write & Read;

		if ((methodResponse as Write).hash) {
			// WRITING (SEND)

			// @ts-ignore
			this.setState({ txBeingSent: methodResponse.hash });
			const receipt = await methodResponse.wait();
			if (receipt.status === 0) {
				throw new Error("Transaction failed");
			}
			return receipt;
		} else {
			// READING (CALL)
			return methodResponse.toString();
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
		newArgs[index] = parseInt(convertWeiToEth(arg));

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
