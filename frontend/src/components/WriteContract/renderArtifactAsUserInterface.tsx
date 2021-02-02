import React from "react";
import {
	DeployedContractAddress,
	DeploymentResponseSingle,
	InitialState,
} from "../Dapp";
import { listInputItem as inputItem } from "./listInputItem";
import { renderContractMethod } from "./renderMethodForm";
interface Params {
	singleDeploymentAbi: DeploymentResponseSingle["abi"];
	singleDeploymentAddress: DeployedContractAddress;
	state: InitialState;
	transactionHandler: Function;
}
export function renderContract({
	singleDeploymentAbi,
	singleDeploymentAddress,
	state,
	transactionHandler,
}: Params) {
	const attributes = {
		className: "contract",
		id: singleDeploymentAddress,
		key: singleDeploymentAddress,
	};

	return (
		<div {...attributes}>
			{
				singleDeploymentAbi
					.map(
						_mapping({
							state,
							transactionHandler,
							address: singleDeploymentAddress,
						})
					)
					.filter(Boolean) as JSX.Element[]
			}
		</div>
	);
}

export interface Method {
	type: string;
	inputs: any;
	name: string;
}
interface MappingParams {
	state: InitialState;
	transactionHandler: Function;
	address: DeployedContractAddress;
}

function _mapping({ state, transactionHandler, address }: MappingParams) {
	return function mapping(
		contractMethod: Method | any
	): JSX.Element | undefined {
		if (contractMethod?.type !== "function") {
			return;
		}

		const contractMethodInputRender = [] as JSX.Element[];

		for (const param of contractMethod.inputs) {
			contractMethodInputRender.push(inputItem(param));
		}

		if (contractMethodInputRender.length) {
			return renderContractMethod({
				address,
				method: contractMethod,
				buffer: contractMethodInputRender,
				state,
				transactionHandler,
			});
		}
		// else {
		// 	return false;
		// }
	};
}
