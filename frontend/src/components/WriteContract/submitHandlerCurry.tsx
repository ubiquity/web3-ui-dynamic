import { SubmitParams } from "./@types";
import { submitHandler } from "./submitHandler";

export function submitHandlerCurry({ state, contract, method, genericTransactionHandler }: SubmitParams) {
	return async (event) => {
		try {
			state.writeContract = await submitHandler({ event, contract, method: method.name, genericTransactionHandler });
		} catch (e) {
			state.transactionError = e;
			return console.error({ e });
		}
	};
}
