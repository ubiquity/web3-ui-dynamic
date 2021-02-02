import { InitialState } from "../Dapp";
import { Method } from "./renderArtifactAsUserInterface";
import { submitHandler } from "./submitHandler";
interface SubmitHandlerParams {
	state: InitialState;
	method: Method;
	transactionHandler: Function;
}
export function submitHandlerCurry({
	state,
	method,
	transactionHandler,
}: SubmitHandlerParams) {
	return async (event) => {
		try {
			state.write = await submitHandler({
				event,
				methodName: method.name,
				transactionHandler,
			});
		} catch (e) {
			state.errors.transaction = e;
			return console.error({ e });
		}
	};
}
