import { WriteContractParams, AbiMethod } from "./@types";
import { listInputItem } from "./listInputItem";
import { renderMethodForm } from "./renderMethodForm";

export function renderArtifactAsUserInterface({ abi, contract, state, genericTransactionHandler }): WriteContractParams {
	const abiMapped = abi.map(_mapping(contract, state, genericTransactionHandler)).filter(Boolean);
	return abiMapped;
}

function _mapping(contract, state, genericTransactionHandler) {
	return function mapping(method: AbiMethod) {
		if (method.type !== "function") {
			return false;
		}

		const buffer = [] as JSX.Element[];

		for (const param of method.inputs) {
			buffer.push(listInputItem(param));
		}

		if (buffer.length) {
			return renderMethodForm({
				method,
				buffer,
				contract,
				state,
				genericTransactionHandler,
			});
		} else {
			return false;
		}
	};
}
